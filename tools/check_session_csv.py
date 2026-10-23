"""
Checks ECITT session CSV files and prints what looks wrong or surprising.

    python tools/check_session_csv.py <file.csv> [more files...]

Works out by itself which kind of file each one is:
    trials CSV, new format  (has FirstResponseCorrect)  -> design checks: 32-trial blocks, 25% inhibitory,
                                                           3 opening prepotent trials, run limits, direction,
                                                           progress count, jitter range
    trials CSV, old format  (summer 2026 and earlier)   -> ratios per task, accuracy values
    events CSV                                          -> row counts, photocell coverage, flash conflicts,
                                                           wrong-tap rows against the trials file
Lines starting with "CHECK" need a look; "ok" lines are fine.
"""
import collections
import csv
import re
import sys

JITTER_RANGE = {'Infant': (500, 1000), 'Child': (500, 2000), 'Adult': (500, 4000)}
FLASH_REQUIRED = {'ReadyScreen', 'LeftTrialScreen', 'RightTrialScreen', 'ControlTrialScreen',
                  'LeftTrialResponse', 'RightTrialResponse', 'ControlTrialResponse',
                  'IncorrectResponse', 'SyncTrainFlash', 'TaskEnd'}


def load(path):
    with open(path, encoding='utf-8-sig', newline='') as handle:
        return list(csv.DictReader(handle))


def say(ok, text):
    print(('ok     ' if ok else 'CHECK  ') + text)


def longest_run(sequence, value):
    best = run = 0
    for item in sequence:
        run = run + 1 if item == value else 0
        best = max(best, run)
    return best


def stamp_seconds(text):
    m = re.match(r'(\d{4}-\d{2}-\d{2})@H(\d+):M(\d+):S([\d.]+)', text)
    return int(m.group(2)) * 3600 + int(m.group(3)) * 60 + float(m.group(4))


def as_int(value):
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return None


# --------------------------------------------------------------------------- trials, new format
def check_new_trials(rows):
    age = rows[0]['AgeGroup']
    print(f"  {len(rows)} rows, bracket {age}, assigned counterbalance {rows[0]['Counterbalance']}")
    phases = collections.Counter(r['Phase'] for r in rows)
    print('  rows per phase:', dict(phases))

    experiment = [r for r in rows if r['Phase'] == 'experiment']
    blocks = collections.OrderedDict()
    for r in experiment:
        blocks.setdefault(r['TaskID'], []).append(r)
    say(len(blocks) >= 1, f'{len(blocks)} experiment block(s): {list(blocks)}')

    inhibitory_done = 0
    for task, block in blocks.items():
        types = [r['TrialType'] for r in block]
        n, inhib = len(block), types.count('Inhibitory')
        prep = types.count('Prepotent')
        complete = n == 32
        label = f'block {task}'
        if complete:
            say(inhib == 8 and prep == 24, f'{label}: 32 trials, {prep} prepotent / {inhib} inhibitory (want 24 / 8 = 75% / 25%)')
            say(types[:3] == ['Prepotent'] * 3, f'{label}: opens with 3 prepotent trials')
            say(longest_run(types, 'Prepotent') <= 5 and longest_run(types, 'Inhibitory') <= 2,
                f"{label}: longest runs {longest_run(types, 'Prepotent')} prepotent / {longest_run(types, 'Inhibitory')} inhibitory (limits 5 / 2)")
        else:
            say(False, f'{label}: only {n} trials (the session ended mid-block) - {prep} prepotent / {inhib} inhibitory')
        for r in block:
            if r['TrialType'] == 'Inhibitory' and r['FirstResponseCorrect'] == '1':
                inhibitory_done += 1
            expected = as_int(r['InhibitoryCompletedSoFar'])
            if expected is not None and expected != inhibitory_done:
                say(False, f"{label} trial {r['TrialNumber']}: InhibitoryCompletedSoFar={expected}, recount={inhibitory_done}")
                break
        else:
            say(True, f'{label}: InhibitoryCompletedSoFar matches a recount (now {inhibitory_done})')

    directions = [r['Direction'] for r in experiment]
    reversed_rows = [r for r in experiment if r['DirectionReversed'] == '1']
    changes = sum(1 for a, b in zip(directions, directions[1:]) if a != b)
    say(changes <= 1 and (changes == 0 or reversed_rows), f'direction changes within the session: {changes} (only allowed once, after a reversal); rows marked reversed: {len(reversed_rows)}')

    acc = [r['FirstResponseCorrect'] for r in experiment]
    if acc:
        pct = 100 * acc.count('1') / len(acc)
        say(pct >= 60, f'first-tap accuracy over experiment trials: {pct:.1f}% (engagement flag below 60%)')
        say(set(acc) <= {'0', '1'}, f'FirstResponseCorrect values: {dict(collections.Counter(acc))}')
    taps = [as_int(r['IncorrectTaps']) for r in experiment]
    say(all(t is not None and t >= 0 for t in taps), f'IncorrectTaps: total {sum(t for t in taps if t)}, max in one trial {max(t for t in taps if t is not None) if taps else 0}')

    lo, hi = JITTER_RANGE.get(age, (0, 10 ** 9))
    jitter = [as_int(r['Jitter1']) for r in experiment]
    bad = [j for j in jitter if j is None or not lo <= j <= hi]
    say(not bad, f'Jitter1 within {lo}-{hi} ms for {age}: {len(jitter) - len(bad)}/{len(jitter)} rows; {len(set(jitter))} distinct values')

    rts = [as_int(r['ReactionTime']) for r in experiment if r['ReactionTime'] != '']
    fast = [t for t in rts if t is not None and t < 150]
    say(not fast, f'reaction times: median {sorted(rts)[len(rts) // 2] if rts else "-"} ms; {len(fast)} under 150 ms (too fast to be a reaction)')
    low = [r for r in experiment if r['LowEngagement'] == '1']
    say(not low, f'LowEngagement flagged on {len(low)} rows')
    dupes = [k for k, c in collections.Counter((r['TaskID'], r['TrialNumber']) for r in experiment).items() if c > 1]
    say(not dupes, f'(TaskID, TrialNumber) is unique across experiment rows: duplicates {dupes}')
    repeats = [k for k, c in collections.Counter((r['TaskID'], r['TrialNumber']) for r in rows if r['Phase'] != 'experiment').items() if c > 1]
    if repeats:
        print(f'  practice repeated ({len(repeats)} task(s) done more than once, normal for Another Practice): tell the attempts apart by StartTimestamp')

    # columns added later: ExperimentBlock, StartTimestamp, RestartedAfterBreak
    if 'ExperimentBlock' in rows[0]:
        nums = sorted({as_int(r['ExperimentBlock']) for r in experiment if as_int(r['ExperimentBlock']) is not None})
        say(nums == list(range(1, len(nums) + 1)) and all(r['ExperimentBlock'] == '' for r in rows if r['Phase'] != 'experiment'),
            f'ExperimentBlock runs 1..{len(nums)} on experiment rows and is blank on demo/practice rows')
        stamps = [r['StartTimestamp'] for r in experiment]
        good = all(re.match(r'\d{4}-\d{2}-\d{2}@H\d+:M\d+:S[\d.]+$', t) for t in stamps)
        say(good, 'every experiment row has a StartTimestamp in the events-file format')
        if good:
            secs = [stamp_seconds(t) for t in stamps]
            say(all(b >= a for a, b in zip(secs, secs[1:])), 'StartTimestamp never goes backwards across experiment trials')
        restarted = sum(1 for r in experiment if r['RestartedAfterBreak'] == '1')
        print(f'  trials restarted after a Break: {restarted}')
    else:
        print('  (this trials file predates ExperimentBlock / StartTimestamp / RestartedAfterBreak)')


# --------------------------------------------------------------------------- trials, old format
def check_old_trials(rows):
    print(f"  OLD format: {len(rows)} rows, bracket {rows[0]['AgeGroup']}")
    by = collections.OrderedDict()
    for r in rows:
        by.setdefault(r['TaskID'], []).append(r)
    total = collections.Counter(r['TrialType'] for r in rows)
    print('  all rows by type:', dict(total))
    for task, rs in by.items():
        c = collections.Counter(r['TrialType'] for r in rs)
        n_test = c['Prepotent'] + c['Inhibitory']
        ratio = f"{100 * c['Prepotent'] / n_test:.0f}% / {100 * c['Inhibitory'] / n_test:.0f}% prepotent/inhibitory" if n_test else 'control block'
        acc = dict(collections.Counter(r['Accuracy'] for r in rs))
        print(f'    {task:10s} n={len(rs):3d}  {dict(c)}  {ratio}  Accuracy values {acc}')
    say(len(set(r['Accuracy'] for r in rows) - {'n/a'}) > 1, 'Accuracy column varies (an always-1 column cannot show errors: the old task waited for the right button)')
    print('  note: old files have no Phase / Direction / IncorrectTaps / FirstResponseCorrect / progress-count columns')


# --------------------------------------------------------------------------- events
def check_events(rows):
    print(f'  {len(rows)} rows')
    counts = collections.Counter(r['SectionStarted'] for r in rows)
    print('  rows by SectionStarted:', dict(counts.most_common()))
    has_flash_col = 'PhotocellFlash' in rows[0]
    if has_flash_col:
        required = [r for r in rows if r['SectionStarted'] in FLASH_REQUIRED]
        missing = [r for r in required if r['PhotocellFlash'] != '1']
        say(not missing, f'photocell: {len(required) - len(missing)}/{len(required)} flash-required rows were locked to a flash')
        for r in missing[:5]:
            print(f"           no flash: {r['SectionStarted']} {r['TrialName']} {r['StartTimestamp']}")
    else:
        print('  (old events file: no PhotocellFlash column, cannot tell which rows were locked to a flash)')
    say(counts['FlashConflict'] == 0, f"FlashConflict rows: {counts['FlashConflict']}")
    wrong = counts['IncorrectResponse']
    print(f'  IncorrectResponse (wrong-tap) rows: {wrong}')
    stamps = [r['StartTimestamp'] for r in rows]
    parsed = [re.match(r'(\d{4}-\d{2}-\d{2})@H(\d+):M(\d+):S([\d.]+)', s) for s in stamps]
    ok_fmt = all(parsed)
    say(ok_fmt, 'every StartTimestamp is in the date@H:M:S format the MATLAB step reads')
    if ok_fmt:
        secs = [int(m.group(2)) * 3600 + int(m.group(3)) * 60 + float(m.group(4)) for m in parsed]
        backwards = sum(1 for a, b in zip(secs, secs[1:]) if b < a - 1e-6)
        say(backwards == 0, f'timestamps never go backwards ({backwards} times they do)')
    must = {'TrialName', 'SectionStarted', 'StartTimestamp'}
    say(must <= set(rows[0]), f'columns the MATLAB step needs are present: {sorted(must)}')


def check_join(trials, events):
    """Every experiment trial should have a stimulus row and a response row in the events file."""
    if 'TrialNumber' not in events[0]:
        print('  (events file has no TrialNumber column: cannot join it to the trials file)')
        return
    have = collections.defaultdict(set)
    for r in events:
        have[r['SectionStarted']].add((r['TrialName'], r['TrialNumber']))
    stim = set().union(*[have[k] for k in ('LeftTrialScreen', 'RightTrialScreen', 'ControlTrialScreen')])
    resp = set().union(*[have[k] for k in ('LeftTrialResponse', 'RightTrialResponse', 'ControlTrialResponse')])
    exp = [(r['TaskID'], r['TrialNumber']) for r in trials if r['Phase'] == 'experiment']
    miss_stim = [k for k in exp if k not in stim]
    miss_resp = [k for k in exp if k not in resp]
    say(not miss_stim and not miss_resp, f'trials file joins to the events file on (TrialName, TrialNumber): {len(exp)} trials, {len(miss_stim)} without a stimulus row, {len(miss_resp)} without a response row')
    wrong_rows = sum(1 for r in events if r['SectionStarted'] == 'IncorrectResponse')
    wrong_taps = sum(as_int(r['IncorrectTaps']) or 0 for r in trials if r['Phase'] in ('experiment', 'practice', 'demo'))
    print(f'  wrong taps: {wrong_rows} IncorrectResponse rows in the events file, IncorrectTaps adds up to {wrong_taps} in the trials file '
          '(they match for Infant; Child/Adult end the trial on the first tap, so their wrong answer is the response row itself)')


def main(paths):
    if not paths:
        sys.exit(__doc__)
    loaded = {}
    for path in paths:
        print('\n=== ' + path)
        rows = load(path)
        if not rows:
            say(False, 'file has no rows')
            continue
        header = set(rows[0])
        loaded[path] = rows
        if 'SectionStarted' in header:
            check_events(rows)
        elif 'FirstResponseCorrect' in header:
            check_new_trials(rows)
        elif 'TrialType' in header:
            check_old_trials(rows)
        else:
            say(False, 'not recognised as an ECITT events or trials CSV (columns: ' + ', '.join(list(header)[:6]) + ' ...)')

    # a trials file and its events file passed together are joined
    for path, rows in loaded.items():
        if rows and 'FirstResponseCorrect' in rows[0] and path.endswith('_trials.csv'):
            partner = path[:-len('_trials.csv')] + '_events.csv'
            if partner in loaded and loaded[partner]:
                print()
                print('=== join: ' + path.split('/')[-1] + ' with ' + partner.split('/')[-1])
                check_join(rows, loaded[partner])


if __name__ == '__main__':
    main(sys.argv[1:])

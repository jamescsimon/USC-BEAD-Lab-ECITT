# Original ECITT Study Test Specifications

## Overview

This document lists all available test specifications from the original ECITT study that are configured in your USC-BEAD-Lab-ECITT system. These are the **correct `specName` values** to use when setting up tests in your Google Sheets.

---

## Quick Reference: Test Spec Names

When adding tests to your Google Sheets **Tests** tab, the `specName` column must match these exact values:

| Display Name       | specName | Age Group      | Orientation | Description                                    |
|-------------------|----------|----------------|-------------|------------------------------------------------|
| **Adult**         | `adt`    | Adult          | Vertical    | Adult inhibitory control task (top/bottom)     |
| **Adult Hor**     | `adth`   | Adult          | Horizontal  | Adult inhibitory control task (left/right)     |
| **9 Months**      | `9m`     | 9 months       | Vertical    | Infant touch task with prepotent/inhibitory    |
| **24 Months 1**   | `24m1`   | 24 months      | Vertical    | Toddler task (version 1)                       |
| **24 Months 2**   | `24m2`   | 24 months      | Vertical    | Toddler task with baseline (version 2)         |
| **24 Months 2 Hor** | `24m2h` | 24 months     | Horizontal  | Toddler task (horizontal orientation)          |
| **48 Months**     | `48m`    | 48 months      | Horizontal  | Preschool age task                             |
| **Box Test**      | `box`    | Infants        | N/A         | A-not-B box task                               |
| **Box Test 3-1**  | `box31`  | Infants        | N/A         | A-not-B box task (3-1 variant)                 |
| **Prohibition**   | `phb`    | Various        | N/A         | Approach/restraint prohibition tasks           |
| **NIRS Ver**      | `nirsv`  | Various        | Vertical    | NIRS baseline tasks (vertical)                 |
| **Nirs Hor**      | `nirsh`  | Various        | Horizontal  | NIRS baseline tasks (horizontal)               |
| **48 Months Nirs**| `48mn`   | 48 months      | Horizontal  | NIRS tasks for 48-month-olds                   |
| **Spatial Confl** | `spc`    | Various        | N/A         | Spatial conflict task                          |
| **Dev**           | `dev`    | Various        | N/A         | Development baseline video tasks               |

---

## How Test Spec Names Work

### 1. Configuration Files
Test specifications are defined in two places:

**XML Configuration** ([cntr.xml](d:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT\private\libs\xml\cntr.xml)):
```xml
<testCntr test="adt" testName="Adult">
    <configCntr config="tspt" configName="Test PR Top">
        <trialCntr test="adt" trialType="ppt" trialPhase="trial" trialName="Prtc PR Top" repeat="4"/>
        <trialCntr test="adt" trialType="tpt" trialPhase="trial" trialName="Test PR Top" repeat="32"/>
    </configCntr>
    ...
</testCntr>
```

The `test="adt"` attribute is what your Google Sheets `specName` must match.

**Trial Configurations** ([configs.xml](d:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT\private\libs\xml\configs.xml)):
```xml
<config id="adt_ppb" name="Practice Btm" layout="ecittTriple" .../>
<config id="adt_tpb" name="Test Btm" .../>
<config id="adt_tpb_prpt" layout="ecittTriple" .../>
<config id="adt_tpb_inhb" layout="ecittTriple" .../>
```

### 2. Page Generation
When you select a test in the Controller, the system:
1. Reads the `specName` from your Google Sheets
2. Looks for `<testCntr test="SPECNAME">` in cntr.xml
3. Generates a page with ID: `SPECNAME_index_page`

For example:
- Google Sheets: `specName = "adt"`
- Generated page: `adt_index_page`
- XSL template creates: `<div id="adt_index_page" ...>`

**If the specName doesn't match**, you get the error:
```
showPage: page element not found: AdultTouchTaskECITT_index_page
```

---

## Common Test Configurations

### Adult Test (`adt`) - Vertical

**Test Structure**:
- **Practice**: 4 trials
- **Test PR Top**: 32 trials (prepotent bottom, inhibit top)
- **Test PR Btm**: 32 trials (prepotent top, inhibit bottom)
- **Control**: Single-button control conditions

**Button Layout**: Three buttons vertically (top, middle, bottom)
- Middle button has a dot (non-responsive)
- Response buttons are top and bottom

**Trial Types**:
- `prpt` (prepotent): Respond to frequent location (75%)
- `inhb` (inhibitory): Respond to infrequent location (25%)

### Adult Hor Test (`adth`) - Horizontal

Same as Adult test but:
- **Button Layout**: Three buttons horizontally (left, center, right)
- **Test PR Lft**: 32 trials (prepotent right, inhibit left)
- **Test PR Rgt**: 32 trials (prepotent left, inhibit right)

### 9 Months Test (`9m`)

**Test Structure**:
- **Test PR Top**: Top prepotent, bottom inhibitory
- **Test PR Btm**: Bottom prepotent, top inhibitory
- **Control 1**: Single-location training
- **Control 2**: Two-location training (no inhibition)

**Button Layout**: Two buttons vertically
- Happy face emoji indicates target button

### 24 Months Tests

**24m1**: Basic version with practice and test blocks
**24m2**: Extended version with baseline trials
**24m2h**: Horizontal orientation variant

---

## Google Sheets Setup

### Example Tests Sheet

```
name            specName    description                                         created
Adult           adt         Adult inhibitory control task (vertical)            2024-01-20
Adult Hor       adth        Adult inhibitory control task (horizontal)          2024-01-20
9 Months        9m          Touch task for 9-month-olds                         2024-01-20
24 Months 2     24m2        Toddler task with baseline trials                   2024-01-20
```

### Troubleshooting

**Error**: `showPage: page element not found: [TESTNAME]_index_page`

**Solution**: Check your Google Sheets **Tests** tab:
1. Verify `specName` column matches one of the values in the table above
2. Common mistake: Using descriptive names like "AdultTouchTaskECITT" instead of "adt"
3. Test spec names are case-sensitive and must be lowercase

---

## Adding Custom Tests

If you want to create a new test:

1. **Add configuration to cntr.xml**:
   ```xml
   <testCntr test="mytest" testName="My Custom Test">
       <configCntr config="cfg1" configName="Config 1">
           <trialCntr test="mytest" trialType="trial1" .../>
       </configCntr>
   </testCntr>
   ```

2. **Add trial configs to configs.xml**:
   ```xml
   <config id="mytest_trial1" name="Trial 1" layout="ecittDouble" .../>
   ```

3. **Add to Google Sheets Tests tab**:
   ```
   name            specName    description         created
   My Custom Test  mytest      Custom test desc    2024-01-20
   ```

4. **Restart server** to reload XML configurations

---

## References

- [cntr.xml](d:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT\private\libs\xml\cntr.xml) - Test structure definitions
- [configs.xml](d:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT\private\libs\xml\configs.xml) - Trial configurations
- [GOOGLE_SHEETS_DATA_SETUP.md](d:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT\GOOGLE_SHEETS_DATA_SETUP.md) - Sheets setup guide
- [seed_test_specs.sql](d:\coding\BEAD Lab\Work\USC-BEAD-Lab-ECITT\database\seed_test_specs.sql) - SQL seed data (for reference)

---

## Summary

✅ Use **exact spec names** from the table above  
✅ Spec names are **case-sensitive** (lowercase)  
✅ Spec names must match `<testCntr test="...">` in cntr.xml  
❌ Don't create custom spec names without adding corresponding XML configs  
❌ Don't use spaces in spec names  

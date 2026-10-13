/**
 * Per-task configuration (TASK_CONFIGS)
 * (split from app.js; load order is set in index.html)
 */

// ===== TASK CONFIGURATIONS =====

const TASK_CONFIGS = {
    // Control: Right (4 trials)
    adt_cr: {
        id: 'adt_cr',
        name: 'Control Right',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 4,
        promptLayout: { left: 'empty', mdl: 'dot', right: 'button' },
        readyMsg1: 'When you see the blue buttons, press the one with the happy face as fast as you can when they appear.',
        readyMsg2: 'When ready, press the red dot.',
        readyMsg3: 'Ready? Let\'s practice!'
    },
    // Control: Left (4 trials)
    adt_cl: {
        id: 'adt_cl',
        name: 'Control Left',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'empty' },
        readyMsg1: 'Great job!',
        readyMsg2: 'When ready to start the next practice, press the red dot.',
        readyMsg3: 'Ready? Let\'s practice the other side!'
    },
    // Control: Middle (4 trials)
    adt_cm: {
        id: 'adt_cm',
        name: 'Control Middle',
        emp: 'mdl',
        empType: 'happy',
        rew: 'mdl',
        trials: 4,
        promptLayout: { left: 'empty', mdl: 'button', right: 'empty' },
        readyMsg1: 'When you see the blue buttons, press the one with the happy face as fast as you can when they appear.',
        readyMsg2: 'When ready, press the red dot.',
        readyMsg3: 'Ready? Let\'s practice!'
    }, 
    // Practice: Left (4 trials)
    adt_ppl: {
        id: 'adt_ppl',
        name: 'Practice Left',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'We will start with practice on both sides! Start with your dominant index finger on the red dot.',
        readyMsg2: 'Press the happy face button that appears as fast as you can.',
        readyMsg3: 'Then return to the dot.',
        readyMsg4: 'Ready to practice?'
    },
    // Practice: Right (4 trials)
    adt_ppr: {
        id: 'adt_ppr',
        name: 'Practice Right',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 4,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'We will start with practice on both sides! Start with your dominant index finger on the red dot.',
        readyMsg2: 'Press the happy face button that appears as fast as you can.',
        readyMsg3: 'Then return to the dot.',
        readyMsg4: 'Ready to practice?'
    },
    // Test: Left (32 trials - 75% left, 25% right)
    adt_tpl: {
        id: 'adt_tpl',
        name: 'Test Left', 
        varDistr: [75, 25], // [prepotent %, inhibitory %]
        varLeading: 3, // First 3 trials are prepotent
        varMaxDups: 4, // Max 4 prepotent consecutive
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Make sure you come back to the red dot after EVERY press!',
        readyMsg4: 'Ready? Let\'s start the real test!',
        // Trial variant configs
        variants: {
            prpt: { emp: 'left', empType: 'happy', rew: 'left' },
            inhb: { emp: 'right', empType: 'happy', rew: 'right' }
        }
    },
    // Test: Right (32 trials - 75% right, 25% left)
    adt_tpr: {
        id: 'adt_tpr',
        name: 'Test Right',
        varDistr: [75, 25],
        varLeading: 3,
        varMaxDups: 4,
        trials: 32,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Excellent! Now for the real test. Keep pressing the happy face as fast as you can.',
        readyMsg2: 'Then return to the dot.',
        readyMsg3: 'Make sure you come back to the red dot after EVERY press!',
        readyMsg4: 'Ready? Let\'s start the real test!',
        variants: {
            prpt: { emp: 'right', empType: 'happy', rew: 'right' },
            inhb: { emp: 'left', empType: 'happy', rew: 'left' }
        }
    },

    // ===== CHILD (2-17) ECITT-A TASK CONFIGURATIONS =====
    // Child Demo: Middle Button
    cha_demo: {
        id: 'cha_demo',
        name: 'Child Demo Middle',
        trialType: 'standard',
        emp: 'mdl',
        empType: 'happy',
        rew: 'mdl',
        trials: 1,
        promptLayout: { left: 'empty', mdl: 'button', right: 'empty' },
        readyMsg1: 'Watch the happy face and press it as fast as you can!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },

    // Child Practice: Left (1 trial) - one button, happy face always left
    cha_ppl: {
        id: 'cha_ppl',
        name: 'Child Practice Left',
        trialType: 'standard',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 1,
        promptLayout: { left: 'button', mdl: 'dot', right: 'empty' },
        readyMsg1: 'Watch the happy face and press it as fast as you can!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Child Practice: Right (1 trials) - one button, happy face always right
    cha_ppr: {
        id: 'cha_ppr',
        name: 'Child Practice Right',
        trialType: 'standard',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 1,
        promptLayout: { left: 'empty', mdl: 'dot', right: 'button' },
        readyMsg1: 'Watch the happy face and press it as fast as you can!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Child Control: Left (8 trials) - both buttons, happy face always left
    cha_cll: {
        id: 'cha_bll',
        name: 'Child Control Left',
        trialType: 'standard',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        allowCorrection: true,
        trials: 8,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great job! Now find the happy face and press it as fast as you can!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Child Control: Right (8 trials) - both buttons, happy face always right
    cha_clr: {
        id: 'cha_blr',
        name: 'Child Control Right',
        trialType: 'standard',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        allowCorrection: true,
        trials: 8,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great job! Now find the happy face and press it as fast as you can!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Child Test: Left (8 trials - 75% left, 25% right)
    cha_tpl: {
        id: 'cha_tpl',
        name: 'Child Test Left',
    
        varDistr: [50, 50],
        varLeading: 1,
        maxSameSide: 2,
        allowCorrection: true,
    
        trials: 8,
    
        promptLayout: {
            left: 'button',
            mdl: 'dot',
            right: 'button'
        },
    
        readyMsg1: 'Great job! Now continue finding the happy face and press it as fast as you can!',
        readyMsg2: '',
        readyMsg3: 'Ready?',
    
        variants: {
            prpt: {
                emp: 'left',
                empType: 'happy',
                rew: 'left'
            },
            inhb: {
                emp: 'right',
                empType: 'happy',
                rew: 'right'
            }
        }
    },
    // Child Test: Right (8 trials - 75% right, 25% left)
    cha_tpr: {
        id: 'cha_tpr',
        name: 'Child Test Right',
    
        varDistr: [50, 50],
        varLeading: 1,
        maxSameSide: 2,
        allowCorrection: true,
    
        trials: 8,
    
        promptLayout: {
            left: 'button',
            mdl: 'dot',
            right: 'button'
        },
    
        readyMsg1: 'Great job! Now continue finding the happy face and press it as fast as you can!',
        readyMsg2: '',
        readyMsg3: 'Ready?',
    
        variants: {
            prpt: {
                emp: 'right',
                empType: 'happy',
                rew: 'right'
            },
            inhb: {
                emp: 'left',
                empType: 'happy',
                rew: 'left'
            }
        }
    },

    // ===== INFANT (10-16 months) ECITT TASK CONFIGURATIONS =====
    // Single button per phase. Control = baseline. Test = prepotent phase then inhibitory phase.
    // Sequence: Control1 Left → Control1 Right →
    //           Test PR Left (prepotent) → Test PR Left (inhibitory) →
    //           Control2 Left → Control2 Right →
    //           Test PR Right (prepotent) → Test PR Right (inhibitory)

    // Demo: Middle Button 
    inf_demo: {
        id: 'inf_demo',
        name: 'Infant Demo Middle',
        trialType: 'standard',
        emp: 'mdl',
        empType: 'happy',
        rew: 'mdl',
        trials: 1,
        promptLayout: { left: 'empty', mdl: 'button', right: 'empty' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Practice 1: Left (1 trials — single left button)
    inf_plp: {
        id: 'inf_plp',
        name: 'Infant Practice Left',
        trialType: 'standard',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        trials: 1,
        promptLayout: { left: 'button', mdl: 'dot', right: 'empty' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Practice 2: Right (1 trials — single right button)
    inf_prp: {
        id: 'inf_prp',
        name: 'Infant Practice Right',
        trialType: 'standard',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        trials: 1,
        promptLayout: { left: 'empty', mdl: 'dot', right: 'button' },
        readyMsg1: 'Watch the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Control: Left (6 trials — 1 demo + 3 trials, both buttons but left is happy)
    inf_c1l: {
        id: 'inf_c1l',
        name: 'Infant Control Left',
        trialType: 'standard',
        emp: 'left',
        empType: 'happy',
        rew: 'left',
        allowCorrection: true,
        trials: 6,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great job! Now find the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Control: Right (6 trials — 1 demo + 3 trials, both buttons but right is happy)
    inf_c1r: {
        id: 'inf_c1r',
        name: 'Infant Control Right',
        trialType: 'standard',
        emp: 'right',
        empType: 'happy',
        rew: 'right',
        allowCorrection: true,
        trials: 6,
        promptLayout: { left: 'button', mdl: 'dot', right: 'button' },
        readyMsg1: 'Great job! Now find the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?'
    },
    // Test PR Left — prepotent phase: left (6 trials, both buttons but left is preponent)
    inf_tpl: {
        id: 'inf_tpl',
        name: 'Infant Test Left',
    
        varDistr: [50,50],
        varLeading: 1,
        maxSameSide: 2,
        allowCorrection: true,
    
        trials: 6,
    
        promptLayout: {
            left: 'button',
            mdl: 'dot',
            right: 'button'
        },
        readyMsg1: 'Great job! Now continue finding the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?',
    
        variants: {
            prpt: {
                emp: 'left',
                empType: 'happy',
                rew: 'left'
            },
            inhb: {
                emp: 'right',
                empType: 'happy',
                rew: 'right'
            }
        }
    },
    // Test PR Right — prepotent phase: right (6 trials, both buttons but right is preponent)
    inf_tpr: {
        id: 'inf_tpr',
        name: 'Infant Test Right',
    
        varDistr: [50,50],
        varLeading: 1,
        maxSameSide: 2,
        allowCorrection: true,
    
        trials: 6,
    
        promptLayout: {
            left: 'button',
            mdl: 'dot',
            right: 'button'
        },
        readyMsg1: 'Great job! Now continue finding the happy face and help baby press it!',
        readyMsg2: '',
        readyMsg3: 'Ready?',
    
        variants: {
            prpt: {
                emp: 'right',
                empType: 'happy',
                rew: 'right'
            },
            inhb: {
                emp: 'left',
                empType: 'happy',
                rew: 'left'
            }
        }
    }
};

    // THE 6-DICE AI ENGINE
    if (ball.x < NET.x + 30) {
        // Roll Dice logic
        if (ball.lock === 0 && Math.abs(ball.x - cpu.x) > 110) {
            let roll;
            // CHECK 1: Net Recovery Logic
            if (cpu.netFail) { 
                roll = 4; // Force "uplift and strike" on net recovery
                cpu.netFail = false; 
            } else { 
                // Rolling 1-6 with no immediate repetition
                do { roll = Math.floor(Math.random() * 6) + 1; } while (roll === cpu.lastDice); 
            }
            cpu.lastDice = roll;
            
            // Dice Strategies
            if (roll === 1) { cpu.strategyGoalX = W * 0.35; cpu.cpuSkill = 'lob'; }   // Forward & Lob
            if (roll === 2) { cpu.strategyGoalX = W * 0.05; cpu.cpuSkill = 'lob'; }   // Back & Lob
            if (roll === 3) { cpu.strategyGoalX = W * 0.20; cpu.cpuSkill = 'lob'; }   // Mid & Lob
            if (roll === 4) { cpu.strategyGoalX = ball.x + 10; cpu.cpuSkill = 'lift'; } // Front Uplift & Strike
            if (roll === 5) { cpu.strategyGoalX = W * 0.25; cpu.cpuSkill = 'lift'; } // Mid Uplift & Strike
            if (roll === 6) { cpu.strategyGoalX = W * 0.10; cpu.cpuSkill = 'lift'; } // Back Uplift & Strike
        }
        
        // CHECK 2: Reaction Logic (Calculate movement if User strikes)
        let reactionSpeed = (p1.actionAnim > 0) ? 11.5 : 9.6; 
        let targetX = (ball.lock > 0) ? cpu.x : ball.x;
        
        // Apply strategy constraints to positioning
        if (cpu.lastDice === 1 || cpu.lastDice === 4) targetX = Math.max(targetX, W * 0.30);
        if (cpu.lastDice === 2 || cpu.lastDice === 6) targetX = Math.min(targetX, W * 0.12);

        cpu.cpuDX = (targetX - cpu.x) > 5 ? reactionSpeed : (targetX - cpu.x) < -5 ? -reactionSpeed : 0;

        // Action Execution (Uplift into Jump/Strike)
        if (Math.abs(ball.x - cpu.x) < 45 && ball.y < cpu.y) {
            // If the strategy is a Strike (Dice 4, 5, 6) or ball is low after a lift
            if ((cpu.lastDice >= 4 || cpu.lastAction === 'lift') && !cpu.air && ball.y < G_Y - 70) {
                cpu.dy = -17.5; 
                cpu.air = true; 
                cpu.cpuSkill = 'spike';
            }
        }
    } else {
        cpu.cpuDX = (cpu.x > W * 0.15) ? -6 : 0;
        cpu.cpuSkill = null;
    }

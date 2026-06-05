const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();

// Initialize session goals
function initializeSessionGoals() {
  try {
    // Run the session-goal-init.js script
    const scriptPath = path.join(projectRoot, 'scripts', 'session-goal-init.js');

    if (fs.existsSync(scriptPath)) {
      // Use dynamic import for ESM module
      const command = `node ${scriptPath}`;
      execSync(command, { stdio: 'inherit' });
      console.log('[SESSION GOALS] Goals initialized for this session');
    }
  } catch (error) {
    console.warn('[SESSION GOALS] Failed to initialize goals:', error.message);
    // Don't fail the session initialization if goal setup fails
  }
}

// Export for hook usage
module.exports = { initializeSessionGoals };

// Execute if run directly
if (require.main === module) {
  initializeSessionGoals();
}

/**
 * UI Functions for Pac-Mon Game
 */

// Game elements
let gameScreen;
let menuScreen;
let gameOverScreen;
let pauseScreen;
let scoreElement;
let livesElement;
let levelElement;
let finalScoreElement;
let highScoreElement;

/**
 * Initialize UI elements
 */
function initializeUI() {
    // Get screen elements
    gameScreen = document.getElementById('game-screen');
    menuScreen = document.getElementById('menu-screen');
    gameOverScreen = document.getElementById('game-over-screen');
    pauseScreen = document.getElementById('pause-screen');
    
    // Get game info elements
    scoreElement = document.getElementById('score');
    livesElement = document.getElementById('lives');
    levelElement = document.getElementById('level');
    finalScoreElement = document.getElementById('final-score');
    highScoreElement = document.getElementById('high-score');
    
    // Initialize menu options
    initializeMenuOptions();
    
    // Show menu screen initially
    showMenuScreen();
}

/**
 * Initialize menu options
 */
function initializeMenuOptions() {
    // Get settings from local storage or use defaults
    const settings = getGameSettings();
    
    // Sound option
    const soundOption = document.getElementById('sound-option');
    soundOption.textContent = settings.sound ? 'Sound: ON' : 'Sound: OFF';
    soundOption.addEventListener('click', toggleSound);
    
    // Difficulty option
    const difficultyOption = document.getElementById('difficulty-option');
    difficultyOption.textContent = `Difficulty: ${settings.difficulty}`;
    difficultyOption.addEventListener('click', toggleDifficulty);
    
    // Controls option
    const controlsOption = document.getElementById('controls-option');
    controlsOption.textContent = `Controls: ${settings.controls}`;
    controlsOption.addEventListener('click', toggleControls);
    
    // Theme option
    const themeOption = document.getElementById('theme-option');
    themeOption.textContent = `Theme: ${settings.theme}`;
    themeOption.addEventListener('click', toggleTheme);
    
    // Apply initial settings
    audioManager.setMuted(!settings.sound);
    document.body.className = '';
    if (settings.theme === THEME.NEON) {
        document.body.classList.add('neon-theme');
    } else if (settings.theme === THEME.RETRO) {
        document.body.classList.add('retro-theme');
    }
}

/**
 * Toggle sound setting
 */
function toggleSound() {
    const settings = getGameSettings();
    settings.sound = !settings.sound;
    saveGameSettings(settings);
    
    // Update sound option text
    const soundOption = document.getElementById('sound-option');
    soundOption.textContent = settings.sound ? 'Sound: ON' : 'Sound: OFF';
    
    // Update audio manager
    audioManager.setMuted(!settings.sound);
}

/**
 * Toggle difficulty setting
 */
function toggleDifficulty() {
    const settings = getGameSettings();
    
    // Cycle through difficulties
    if (settings.difficulty === DIFFICULTY.EASY) {
        settings.difficulty = DIFFICULTY.MEDIUM;
    } else if (settings.difficulty === DIFFICULTY.MEDIUM) {
        settings.difficulty = DIFFICULTY.HARD;
    } else {
        settings.difficulty = DIFFICULTY.EASY;
    }
    
    saveGameSettings(settings);
    
    // Update difficulty option text
    const difficultyOption = document.getElementById('difficulty-option');
    difficultyOption.textContent = `Difficulty: ${settings.difficulty}`;
    
    // Update game difficulty if game instance exists
    if (window.game) {
        window.game.setDifficulty(settings.difficulty);
    }
}

/**
 * Toggle controls setting
 */
function toggleControls() {
    const settings = getGameSettings();
    
    // Toggle between ARROWS and WASD
    settings.controls = settings.controls === CONTROLS.ARROWS ? CONTROLS.WASD : CONTROLS.ARROWS;
    saveGameSettings(settings);
    
    // Update controls option text
    const controlsOption = document.getElementById('controls-option');
    controlsOption.textContent = `Controls: ${settings.controls}`;
    
    // Update game controls if game instance exists
    if (window.game) {
        window.game.setControlsType(settings.controls);
    }
}

/**
 * Toggle theme setting
 */
function toggleTheme() {
    const settings = getGameSettings();
    
    // Cycle through themes
    if (settings.theme === THEME.CLASSIC) {
        settings.theme = THEME.NEON;
    } else if (settings.theme === THEME.NEON) {
        settings.theme = THEME.RETRO;
    } else {
        settings.theme = THEME.CLASSIC;
    }
    
    saveGameSettings(settings);
    
    // Update theme option text
    const themeOption = document.getElementById('theme-option');
    themeOption.textContent = `Theme: ${settings.theme}`;
    
    // Apply theme
    document.body.className = '';
    if (settings.theme === THEME.NEON) {
        document.body.classList.add('neon-theme');
    } else if (settings.theme === THEME.RETRO) {
        document.body.classList.add('retro-theme');
    }
    
    // Update game theme if game instance exists
    if (window.game) {
        window.game.setTheme(settings.theme);
    }
}

/**
 * Show menu screen
 */
function showMenuScreen() {
    hideAllScreens();
    menuScreen.style.display = 'flex';
}

/**
 * Show game screen
 */
function showGameScreen() {
    hideAllScreens();
    gameScreen.style.display = 'block';
}

/**
 * Show game over screen
 * @param {number} score - Final score
 */
function showGameOverScreen(score) {
    hideAllScreens();
    
    // Update final score
    finalScoreElement.textContent = score;
    
    // Update high score
    const highScore = getHighScore();
    highScoreElement.textContent = highScore;
    
    gameOverScreen.style.display = 'flex';
}

/**
 * Show pause screen
 */
function showPauseScreen() {
    pauseScreen.style.display = 'flex';
}

/**
 * Hide pause screen
 */
function hidePauseScreen() {
    pauseScreen.style.display = 'none';
}

/**
 * Hide all screens
 */
function hideAllScreens() {
    gameScreen.style.display = 'none';
    menuScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
}

/**
 * Update game UI elements
 * @param {number} score - Current score
 * @param {number} lives - Current lives
 * @param {number} level - Current level
 */
function updateGameUI(score, lives, level) {
    scoreElement.textContent = score;
    livesElement.textContent = '❤'.repeat(lives);
    levelElement.textContent = level;
}

/**
 * Start new game
 */
function startNewGame() {
    // Get game settings
    const settings = getGameSettings();
    
    // Apply settings to game
    window.game.setDifficulty(settings.difficulty);
    window.game.setControlsType(settings.controls);
    window.game.setTheme(settings.theme);
    
    // Start game
    window.game.startGame();
    
    // Show game screen
    showGameScreen();
}

/**
 * Restart game from game over
 */
function restartGame() {
    window.game.restartGame();
}

/**
 * Return to main menu
 */
function returnToMenu() {
    window.game.returnToMenu();
}
/**
 * Main JavaScript file for Pac-Mon Game
 */

// Global game instance
let game;

// Global audio manager
let audioManager;

/**
 * Initialize game when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio manager
    audioManager = new AudioManager();
    
    // Initialize UI
    initializeUI();
    
    // Get canvas element
    const canvas = document.getElementById('game-canvas');
    
    // Create game instance
    game = new Game(canvas);
    window.game = game; // Make game accessible globally
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Keyboard events for game controls
    document.addEventListener('keydown', (event) => {
        game.handleKeyDown(event);
    });
    
    // Start game button
    document.getElementById('start-game').addEventListener('click', startNewGame);
    
    // Pause button
    document.getElementById('pause-button').addEventListener('click', () => {
        game.togglePause();
    });
    
    // Resume button
    document.getElementById('resume-button').addEventListener('click', () => {
        game.resumeGame();
    });
    
    // Restart button (from pause)
    document.getElementById('restart-button').addEventListener('click', () => {
        game.restartGame();
    });
    
    // Menu button (from pause)
    document.getElementById('menu-button').addEventListener('click', () => {
        game.returnToMenu();
    });
    
    // Play again button (from game over)
    document.getElementById('play-again').addEventListener('click', restartGame);
    
    // Menu button (from game over)
    document.getElementById('menu-button-gameover').addEventListener('click', returnToMenu);
    
    // Handle window resize
    window.addEventListener('resize', resizeGame);
    
    // Initial resize
    resizeGame();
}

/**
 * Resize game canvas to fit window
 */
function resizeGame() {
    const gameContainer = document.getElementById('game-container');
    const canvas = document.getElementById('game-canvas');
    
    // Get container dimensions
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;
    
    // Calculate game dimensions
    const gameWidth = GRID_WIDTH * CELL_SIZE;
    const gameHeight = GRID_HEIGHT * CELL_SIZE;
    
    // Calculate scale factor to fit game in container
    const scaleX = containerWidth / gameWidth;
    const scaleY = containerHeight / gameHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond original size
    
    // Apply scale
    canvas.style.transform = `scale(${scale})`;
    
    // Center game in container
    const scaledWidth = gameWidth * scale;
    const scaledHeight = gameHeight * scale;
    canvas.style.left = `${(containerWidth - scaledWidth) / 2}px`;
    canvas.style.top = `${(containerHeight - scaledHeight) / 2}px`;
}
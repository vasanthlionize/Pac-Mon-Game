/**
 * Main Game Class
 */

class Game {
    /**
     * Create a new game
     * @param {HTMLCanvasElement} canvas - Game canvas element
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = GAME_STATE.MENU;
        this.score = 0;
        this.level = 1;
        this.difficulty = DIFFICULTY.EASY;
        this.controlsType = CONTROLS.ARROWS;
        this.theme = THEME.CLASSIC;
        this.keyMap = KEY_MAPPINGS.ARROWS;
        this.lastFrameTime = 0;
        this.isPaused = false;
        
        // Game objects
        this.maze = new Maze();
        this.player = null;
        this.enemies = [];
        this.powerUpManager = new PowerUpManager();
        
        // Initialize game
        this.initialize();
        
        // Start game loop
        this.gameLoop();
    }

    /**
     * Initialize game
     */
    initialize() {
        // Set canvas size
        this.canvas.width = GRID_WIDTH * CELL_SIZE;
        this.canvas.height = GRID_HEIGHT * CELL_SIZE;
        
        // Initialize maze
        this.maze.initialize(this.level);
        
        // Create player
        const playerSpeed = SPEED[this.difficulty].PLAYER;
        this.player = new Player(this.maze.playerSpawn.x, this.maze.playerSpawn.y, playerSpeed);
        
        // Create enemies
        this.createEnemies();
    }

    /**
     * Create enemies based on level and difficulty
     */
    createEnemies() {
        this.enemies = [];
        
        const enemySpeed = SPEED[this.difficulty].ENEMY;
        const spawnX = this.maze.enemySpawn.x;
        const spawnY = this.maze.enemySpawn.y;
        
        // Always create the four basic enemy types
        this.enemies.push(new Enemy(spawnX, spawnY, enemySpeed, ENEMY_TYPE.CHASER));
        this.enemies.push(new Enemy(spawnX, spawnY - CELL_SIZE, enemySpeed, ENEMY_TYPE.AMBUSHER));
        this.enemies.push(new Enemy(spawnX - CELL_SIZE, spawnY, enemySpeed, ENEMY_TYPE.RANDOM));
        this.enemies.push(new Enemy(spawnX + CELL_SIZE, spawnY, enemySpeed, ENEMY_TYPE.SHY));
        
        // Add more enemies for higher levels (up to 8 total)
        const extraEnemies = Math.min(4, Math.floor(this.level / 3));
        
        for (let i = 0; i < extraEnemies; i++) {
            const type = getRandomItem([
                ENEMY_TYPE.CHASER,
                ENEMY_TYPE.AMBUSHER,
                ENEMY_TYPE.RANDOM,
                ENEMY_TYPE.SHY
            ]);
            
            this.enemies.push(new Enemy(spawnX, spawnY, enemySpeed, type));
        }
    }

    /**
     * Start a new game
     */
    startGame() {
        this.state = GAME_STATE.PLAYING;
        this.score = 0;
        this.level = 1;
        this.player.lives = 3;
        
        // Initialize first level
        this.startLevel();
        
        // Play game start sound
        audioManager.play('gameStart');
        
        // Update UI
        updateGameUI(this.score, this.player.lives, this.level);
    }

    /**
     * Start a new level
     */
    startLevel() {
        // Initialize maze for current level
        this.maze.initialize(this.level);
        
        // Reset player position
        this.player.reset(this.maze.playerSpawn.x, this.maze.playerSpawn.y);
        
        // Adjust player speed based on level and difficulty
        const levelSpeedMultiplier = 1 + (this.level - 1) * 0.1; // 10% increase per level
        this.player.baseSpeed = SPEED[this.difficulty].PLAYER * levelSpeedMultiplier;
        this.player.speed = this.player.baseSpeed;
        
        // Create enemies with adjusted speed
        const enemySpeedMultiplier = 1 + (this.level - 1) * 0.1; // 10% increase per level
        const enemySpeed = SPEED[this.difficulty].ENEMY * enemySpeedMultiplier;
        
        this.createEnemies();
        
        // Clear power-ups
        this.powerUpManager.clearAllPowerUps(this.player, this.enemies);
    }

    /**
     * Game loop
     * @param {number} timestamp - Current timestamp
     */
    gameLoop(timestamp = 0) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Update game if not paused
        if (this.state === GAME_STATE.PLAYING && !this.isPaused) {
            this.update(deltaTime);
        }
        
        // Draw game
        this.draw();
        
        // Request next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Update game state
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        // Update player
        this.player.update(this.maze.grid);
        
        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(this.maze.grid, this.player);
        });
        
        // Update power-ups
        this.powerUpManager.update();
        
        // Check collisions
        this.checkCollisions();
        
        // Check if level is complete
        if (this.maze.allDotsCollected()) {
            this.completeLevel();
        }
    }

    /**
     * Check for collisions between game objects
     */
    checkCollisions() {
        // Get player grid position
        const playerGridPos = pixelToGrid(this.player.x, this.player.y);
        
        // Check for dot collection
        if (this.maze.hasDot(playerGridPos.x, playerGridPos.y)) {
            if (this.maze.collectDot(playerGridPos.x, playerGridPos.y)) {
                this.score += SCORE.DOT;
                audioManager.play('chomp');
                updateGameUI(this.score, this.player.lives, this.level);
            }
        }
        
        // Check for power pellet collection
        if (this.maze.hasPowerPellet(playerGridPos.x, playerGridPos.y)) {
            if (this.maze.collectPowerPellet(playerGridPos.x, playerGridPos.y)) {
                this.score += SCORE.POWER_UP;
                this.powerUpManager.activatePowerUp(POWER_UP_TYPE.GHOST_VULNERABILITY, this.player, this.enemies);
                updateGameUI(this.score, this.player.lives, this.level);
            }
        }
        
        // Check for fruit collection
        if (this.maze.hasFruit(playerGridPos.x, playerGridPos.y)) {
            if (this.maze.collectFruit(playerGridPos.x, playerGridPos.y)) {
                this.score += SCORE.FRUIT;
                audioManager.play('fruit');
                updateGameUI(this.score, this.player.lives, this.level);
            }
        }
        
        // Check for enemy collisions
        this.enemies.forEach(enemy => {
            if (!enemy.eaten && checkCollision({ x: this.player.x, y: this.player.y }, { x: enemy.x, y: enemy.y })) {
                if (enemy.vulnerable) {
                    // Player eats enemy
                    enemy.getEaten(5000, this.maze.enemySpawn.x, this.maze.enemySpawn.y);
                    this.score += SCORE.GHOST;
                    audioManager.play('ghostEaten');
                    updateGameUI(this.score, this.player.lives, this.level);
                } else if (this.player.alive) {
                    // Enemy kills player
                    this.playerDeath();
                }
            }
        });
    }

    /**
     * Handle player death
     */
    playerDeath() {
        if (this.player.die()) {
            // Player has lives left
            audioManager.play('death');
            
            // Reset player position
            setTimeout(() => {
                this.player.reset(this.maze.playerSpawn.x, this.maze.playerSpawn.y);
                
                // Reset enemy positions
                this.enemies.forEach(enemy => {
                    enemy.reset(this.maze.enemySpawn.x, this.maze.enemySpawn.y);
                });
                
                // Clear power-ups
                this.powerUpManager.clearAllPowerUps(this.player, this.enemies);
                
                // Update UI
                updateGameUI(this.score, this.player.lives, this.level);
            }, 1000);
        } else {
            // Game over
            this.gameOver();
        }
    }

    /**
     * Complete current level
     */
    completeLevel() {
        // Add level clear bonus
        this.score += SCORE.LEVEL_CLEAR;
        
        // Increment level
        this.level++;
        
        // Play level up sound
        audioManager.play('levelUp');
        
        // Start next level after delay
        setTimeout(() => {
            this.startLevel();
            updateGameUI(this.score, this.player.lives, this.level);
        }, 1000);
    }

    /**
     * Game over
     */
    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        
        // Play game over sound
        audioManager.play('gameOver');
        
        // Save high score
        saveHighScore(this.score);
        
        // Show game over screen
        showGameOverScreen(this.score);
    }

    /**
     * Draw game
     */
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Only draw game elements if in playing state
        if (this.state === GAME_STATE.PLAYING || this.state === GAME_STATE.PAUSED) {
            // Draw maze
            this.maze.draw(this.ctx);
            
            // Draw player
            this.player.draw(this.ctx);
            
            // Draw enemies
            this.enemies.forEach(enemy => {
                enemy.draw(this.ctx);
            });
            
            // Draw power-up effects
            this.powerUpManager.draw(this.ctx);
            
            // Draw pause overlay if paused
            if (this.isPaused) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.ctx.fillStyle = 'white';
                this.ctx.font = '24px "Press Start 2P"';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            }
        }
    }

    /**
     * Set game difficulty
     * @param {string} difficulty - Difficulty level
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        // Update player and enemy speeds
        if (this.player) {
            this.player.baseSpeed = SPEED[this.difficulty].PLAYER;
            this.player.speed = this.player.baseSpeed;
        }
        
        if (this.enemies.length > 0) {
            const enemySpeed = SPEED[this.difficulty].ENEMY;
            this.enemies.forEach(enemy => {
                enemy.baseSpeed = enemySpeed;
                enemy.speed = enemySpeed;
            });
        }
    }

    /**
     * Set controls type
     * @param {string} controlsType - Controls type
     */
    setControlsType(controlsType) {
        this.controlsType = controlsType;
        this.keyMap = controlsType === CONTROLS.ARROWS ? KEY_MAPPINGS.ARROWS : KEY_MAPPINGS.WASD;
    }

    /**
     * Set game theme
     * @param {string} theme - Game theme
     */
    setTheme(theme) {
        this.theme = theme;
        
        // Apply theme to body class
        document.body.className = '';
        
        if (theme === THEME.NEON) {
            document.body.classList.add('neon-theme');
        } else if (theme === THEME.RETRO) {
            document.body.classList.add('retro-theme');
        }
        // Classic theme is default (no class)
    }

    /**
     * Handle key down event
     * @param {KeyboardEvent} event - Key event
     */
    handleKeyDown(event) {
        // Only handle keys if in playing state
        if (this.state !== GAME_STATE.PLAYING) return;
        
        // Get direction from key map
        const direction = this.keyMap[event.keyCode];
        
        if (direction) {
            this.player.setDirection(direction);
        }
        
        // Pause game on Escape key
        if (event.keyCode === 27) { // Escape key
            this.togglePause();
        }
    }

    /**
     * Toggle game pause state
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            showPauseScreen();
        } else {
            hidePauseScreen();
        }
    }

    /**
     * Resume game from pause
     */
    resumeGame() {
        this.isPaused = false;
        hidePauseScreen();
    }

    /**
     * Restart game
     */
    restartGame() {
        this.isPaused = false;
        this.startGame();
        hideAllScreens();
        showGameScreen();
    }

    /**
     * Return to main menu
     */
    returnToMenu() {
        this.state = GAME_STATE.MENU;
        this.isPaused = false;
        hideAllScreens();
        showMenuScreen();
    }
}
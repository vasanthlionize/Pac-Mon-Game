/**
 * Maze Class
 */

class Maze {
    /**
     * Create a new maze
     */
    constructor() {
        this.grid = [];
        this.dotsCount = 0;
        this.dotsCollected = 0;
        this.powerPellets = [];
        this.fruits = [];
        this.playerSpawn = { x: 0, y: 0 };
        this.enemySpawn = { x: 0, y: 0 };
        this.tunnels = [];
    }

    /**
     * Initialize maze with a predefined layout
     * @param {number} level - Current game level
     */
    initialize(level) {
        // Reset counters
        this.dotsCount = 0;
        this.dotsCollected = 0;
        this.powerPellets = [];
        this.fruits = [];
        this.tunnels = [];
        
        // Create maze layout based on level
        this.createMazeLayout(level);
        
        // Count total dots
        this.countDots();
    }

    /**
     * Create maze layout based on level
     * @param {number} level - Current game level
     */
    createMazeLayout(level) {
        // For simplicity, we'll use a predefined layout
        // In a full game, you might want to generate different layouts for different levels
        
        // Classic Pac-Man inspired layout
        // 0 = empty, 1 = wall, 2 = dot, 3 = power pellet, 4 = tunnel, 5 = enemy spawn, 6 = player spawn
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 5, 5, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
            [4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4],
            [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 6, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 3, 1],
            [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
            [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        
        // Find player and enemy spawn points
        this.findSpawnPoints();
        
        // Find tunnels
        this.findTunnels();
        
        // Add power pellets
        this.findPowerPellets();
        
        // Add difficulty based on level
        if (level > 1) {
            this.adjustDifficultyForLevel(level);
        }
    }

    /**
     * Find player and enemy spawn points in the grid
     */
    findSpawnPoints() {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === CELL_TYPE.PLAYER_SPAWN) {
                    this.playerSpawn = gridToPixel(x, y);
                } else if (this.grid[y][x] === CELL_TYPE.ENEMY_SPAWN) {
                    this.enemySpawn = gridToPixel(x, y);
                }
            }
        }
    }

    /**
     * Find tunnels in the grid
     */
    findTunnels() {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === CELL_TYPE.TUNNEL) {
                    this.tunnels.push({ x, y });
                }
            }
        }
    }

    /**
     * Find power pellets in the grid
     */
    findPowerPellets() {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === CELL_TYPE.POWER_PELLET) {
                    this.powerPellets.push({ x, y });
                }
            }
        }
    }

    /**
     * Adjust difficulty based on level
     * @param {number} level - Current game level
     */
    adjustDifficultyForLevel(level) {
        // Add more walls or remove some dots to make it harder
        const modifications = Math.min(5, level - 1); // Cap at 5 modifications
        
        for (let i = 0; i < modifications; i++) {
            // Randomly convert some dots to walls
            const y = Math.floor(Math.random() * this.grid.length);
            const x = Math.floor(Math.random() * this.grid[0].length);
            
            if (this.grid[y][x] === CELL_TYPE.DOT) {
                this.grid[y][x] = CELL_TYPE.WALL;
            }
        }
        
        // Add a fruit every 2 levels
        if (level % 2 === 0) {
            this.addRandomFruit();
        }
    }

    /**
     * Add a random fruit to the maze
     */
    addRandomFruit() {
        // Find empty spaces or dots where we can place a fruit
        const validPositions = [];
        
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === CELL_TYPE.EMPTY || this.grid[y][x] === CELL_TYPE.DOT) {
                    validPositions.push({ x, y });
                }
            }
        }
        
        if (validPositions.length > 0) {
            const position = getRandomItem(validPositions);
            this.fruits.push(position);
        }
    }

    /**
     * Count total dots in the maze
     */
    countDots() {
        this.dotsCount = 0;
        
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === CELL_TYPE.DOT) {
                    this.dotsCount++;
                }
            }
        }
    }

    /**
     * Check if a cell contains a dot
     * @param {number} x - X position in grid
     * @param {number} y - Y position in grid
     * @returns {boolean} - True if cell contains a dot
     */
    hasDot(x, y) {
        if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
            return false;
        }
        
        return this.grid[y][x] === CELL_TYPE.DOT;
    }

    /**
     * Check if a cell contains a power pellet
     * @param {number} x - X position in grid
     * @param {number} y - Y position in grid
     * @returns {boolean} - True if cell contains a power pellet
     */
    hasPowerPellet(x, y) {
        if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
            return false;
        }
        
        return this.grid[y][x] === CELL_TYPE.POWER_PELLET;
    }

    /**
     * Check if a cell contains a fruit
     * @param {number} x - X position in grid
     * @param {number} y - Y position in grid
     * @returns {boolean} - True if cell contains a fruit
     */
    hasFruit(x, y) {
        return this.fruits.some(fruit => fruit.x === x && fruit.y === y);
    }

    /**
     * Collect a dot from the maze
     * @param {number} x - X position in grid
     * @param {number} y - Y position in grid
     * @returns {boolean} - True if dot was collected
     */
    collectDot(x, y) {
        if (this.hasDot(x, y)) {
            this.grid[y][x] = CELL_TYPE.EMPTY;
            this.dotsCollected++;
            return true;
        }
        return false;
    }

    /**
     * Collect a power pellet from the maze
     * @param {number} x - X position in grid
     * @param {number} y - Y position in grid
     * @returns {boolean} - True if power pellet was collected
     */
    collectPowerPellet(x, y) {
        if (this.hasPowerPellet(x, y)) {
            this.grid[y][x] = CELL_TYPE.EMPTY;
            // Remove from power pellets array
            this.powerPellets = this.powerPellets.filter(pellet => !(pellet.x === x && pellet.y === y));
            return true;
        }
        return false;
    }

    /**
     * Collect a fruit from the maze
     * @param {number} x - X position in grid
     * @param {number} y - Y position in grid
     * @returns {boolean} - True if fruit was collected
     */
    collectFruit(x, y) {
        const fruitIndex = this.fruits.findIndex(fruit => fruit.x === x && fruit.y === y);
        
        if (fruitIndex !== -1) {
            this.fruits.splice(fruitIndex, 1);
            return true;
        }
        return false;
    }

    /**
     * Check if all dots have been collected
     * @returns {boolean} - True if all dots have been collected
     */
    allDotsCollected() {
        return this.dotsCollected >= this.dotsCount;
    }

    /**
     * Draw maze on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        const cellSize = CELL_SIZE;
        
        // Draw maze cells
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const cellType = this.grid[y][x];
                const pixelX = x * cellSize;
                const pixelY = y * cellSize;
                
                // Draw walls
                if (cellType === CELL_TYPE.WALL) {
                    ctx.fillStyle = 'var(--wall-color)';
                    ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
                    
                    // Add a slight glow effect to walls
                    ctx.shadowColor = 'var(--wall-color)';
                    ctx.shadowBlur = 5;
                    ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
                    ctx.strokeRect(pixelX, pixelY, cellSize, cellSize);
                    ctx.shadowBlur = 0;
                }
                
                // Draw dots
                else if (cellType === CELL_TYPE.DOT) {
                    ctx.beginPath();
                    ctx.arc(pixelX + cellSize / 2, pixelY + cellSize / 2, cellSize / 10, 0, Math.PI * 2);
                    ctx.fillStyle = 'var(--dot-color)';
                    ctx.fill();
                }
                
                // Draw power pellets
                else if (cellType === CELL_TYPE.POWER_PELLET) {
                    ctx.beginPath();
                    ctx.arc(pixelX + cellSize / 2, pixelY + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
                    ctx.fillStyle = 'var(--power-up-color)';
                    ctx.fill();
                    
                    // Add pulsing effect
                    const pulseSize = Math.sin(Date.now() / 200) * 2 + 4;
                    ctx.beginPath();
                    ctx.arc(pixelX + cellSize / 2, pixelY + cellSize / 2, cellSize / pulseSize, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.fill();
                }
            }
        }
        
        // Draw fruits
        this.fruits.forEach(fruit => {
            const pixelX = fruit.x * cellSize;
            const pixelY = fruit.y * cellSize;
            
            // Draw a simple cherry for now
            ctx.beginPath();
            ctx.arc(pixelX + cellSize / 2 - 3, pixelY + cellSize / 2, cellSize / 5, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(pixelX + cellSize / 2 + 3, pixelY + cellSize / 2, cellSize / 5, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.fill();
            
            // Draw stem
            ctx.beginPath();
            ctx.moveTo(pixelX + cellSize / 2 - 3, pixelY + cellSize / 2 - 5);
            ctx.lineTo(pixelX + cellSize / 2, pixelY + cellSize / 2 - 10);
            ctx.lineTo(pixelX + cellSize / 2 + 3, pixelY + cellSize / 2 - 5);
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
}
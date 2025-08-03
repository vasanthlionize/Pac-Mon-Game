/**
 * Utility Functions
 */

/**
 * Check if two positions are colliding
 * @param {Object} pos1 - First position with x and y coordinates
 * @param {Object} pos2 - Second position with x and y coordinates
 * @param {number} threshold - Distance threshold for collision
 * @returns {boolean} - True if positions are colliding
 */
function checkCollision(pos1, pos2, threshold = CELL_SIZE / 2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < threshold;
}

/**
 * Convert grid position to pixel position
 * @param {number} gridX - X position in grid
 * @param {number} gridY - Y position in grid
 * @returns {Object} - Pixel position {x, y}
 */
function gridToPixel(gridX, gridY) {
    return {
        x: gridX * CELL_SIZE + CELL_SIZE / 2,
        y: gridY * CELL_SIZE + CELL_SIZE / 2
    };
}

/**
 * Convert pixel position to grid position
 * @param {number} pixelX - X position in pixels
 * @param {number} pixelY - Y position in pixels
 * @returns {Object} - Grid position {x, y}
 */
function pixelToGrid(pixelX, pixelY) {
    return {
        x: Math.floor(pixelX / CELL_SIZE),
        y: Math.floor(pixelY / CELL_SIZE)
    };
}

/**
 * Check if a move is valid (not hitting a wall)
 * @param {Object} position - Current position {x, y} in pixels
 * @param {Object} direction - Direction {x, y}
 * @param {Array} maze - 2D array representing the maze
 * @returns {boolean} - True if move is valid
 */
function isValidMove(position, direction, maze) {
    const nextPos = {
        x: position.x + direction.x,
        y: position.y + direction.y
    };
    
    const gridPos = pixelToGrid(nextPos.x, nextPos.y);
    
    // Check if position is within grid bounds
    if (gridPos.x < 0 || gridPos.x >= GRID_WIDTH || 
        gridPos.y < 0 || gridPos.y >= GRID_HEIGHT) {
        return false;
    }
    
    // Check if position is a wall
    return maze[gridPos.y][gridPos.x] !== CELL_TYPE.WALL;
}

/**
 * Get available directions from current position
 * @param {Object} position - Current position {x, y} in pixels
 * @param {Array} maze - 2D array representing the maze
 * @returns {Array} - Array of valid directions
 */
function getAvailableDirections(position, maze) {
    const directions = [];
    
    if (isValidMove(position, DIRECTION.UP, maze)) {
        directions.push(DIRECTION.UP);
    }
    
    if (isValidMove(position, DIRECTION.DOWN, maze)) {
        directions.push(DIRECTION.DOWN);
    }
    
    if (isValidMove(position, DIRECTION.LEFT, maze)) {
        directions.push(DIRECTION.LEFT);
    }
    
    if (isValidMove(position, DIRECTION.RIGHT, maze)) {
        directions.push(DIRECTION.RIGHT);
    }
    
    return directions;
}

/**
 * Get random item from array
 * @param {Array} array - Array to get random item from
 * @returns {*} - Random item from array
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Calculate distance between two points
 * @param {Object} pos1 - First position {x, y}
 * @param {Object} pos2 - Second position {x, y}
 * @returns {number} - Distance between points
 */
function calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Save high score to local storage
 * @param {number} score - Score to save
 */
function saveHighScore(score) {
    const currentHighScore = getHighScore();
    if (score > currentHighScore) {
        localStorage.setItem('pacMonHighScore', score.toString());
    }
}

/**
 * Get high score from local storage
 * @returns {number} - High score
 */
function getHighScore() {
    const highScore = localStorage.getItem('pacMonHighScore');
    return highScore ? parseInt(highScore) : 0;
}

/**
 * Save game settings to local storage
 * @param {Object} settings - Game settings
 */
function saveGameSettings(settings) {
    localStorage.setItem('pacMonSettings', JSON.stringify(settings));
}

/**
 * Get game settings from local storage
 * @returns {Object} - Game settings
 */
function getGameSettings() {
    const settings = localStorage.getItem('pacMonSettings');
    return settings ? JSON.parse(settings) : {
        sound: true,
        difficulty: DIFFICULTY.EASY,
        controls: CONTROLS.ARROWS,
        theme: THEME.CLASSIC
    };
}
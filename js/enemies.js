/**
 * Enemies (Glitch-Monsters) Class
 */

class Enemy {
    /**
     * Create a new enemy
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} speed - Enemy movement speed
     * @param {string} type - Enemy type (chaser, ambusher, random, shy)
     */
    constructor(x, y, speed, type) {
        this.x = x;
        this.y = y;
        this.baseSpeed = speed;
        this.speed = speed;
        this.type = type;
        this.direction = DIRECTION.NONE;
        this.color = ENEMY_COLOR[type.toUpperCase()];
        this.size = CELL_SIZE - 4; // Slightly smaller than cell
        this.vulnerable = false;
        this.eaten = false;
        this.respawnTimer = null;
        this.animationCounter = 0;
        this.eyeDirection = { x: 0, y: -1 }; // Default eye direction (looking up)
    }

    /**
     * Update enemy position and state
     * @param {Array} maze - 2D array representing the maze
     * @param {Player} player - Player object
     */
    update(maze, player) {
        // If eaten, don't update position
        if (this.eaten) return;

        // Update animation counter
        this.animationCounter++;

        // Determine next direction based on enemy type
        this.determineDirection(maze, player);

        // Move in current direction if valid
        if (this.direction !== DIRECTION.NONE && 
            isValidMove({ x: this.x, y: this.y }, this.direction, maze)) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;

            // Handle tunnel wrap-around
            this.handleTunnelWrap(maze);
        } else {
            // If can't move in current direction, find a new direction
            this.findNewDirection(maze, player);
        }

        // Update eye direction based on movement direction
        this.updateEyeDirection();
    }

    /**
     * Determine direction based on enemy type
     * @param {Array} maze - 2D array representing the maze
     * @param {Player} player - Player object
     */
    determineDirection(maze, player) {
        // At grid intersections, determine new direction
        const gridPos = pixelToGrid(this.x, this.y);
        const centerOfCell = gridToPixel(gridPos.x, gridPos.y);
        const atIntersection = Math.abs(this.x - centerOfCell.x) < 1 && Math.abs(this.y - centerOfCell.y) < 1;
        
        if (!atIntersection) return;

        // Get available directions at current position
        const availableDirections = getAvailableDirections({ x: this.x, y: this.y }, maze);
        
        // Remove opposite direction to prevent 180-degree turns
        const oppositeDirection = {
            x: this.direction.x * -1,
            y: this.direction.y * -1
        };
        
        const filteredDirections = availableDirections.filter(dir => 
            !(dir.x === oppositeDirection.x && dir.y === oppositeDirection.y)
        );
        
        // If no valid directions (other than going back), allow going back
        const validDirections = filteredDirections.length > 0 ? filteredDirections : availableDirections;
        
        // Choose direction based on enemy type and vulnerability state
        if (this.vulnerable) {
            // When vulnerable, all enemies try to flee from player
            this.fleeFromPlayer(player, validDirections);
        } else {
            switch (this.type) {
                case ENEMY_TYPE.CHASER:
                    this.chasePlayer(player, validDirections);
                    break;
                case ENEMY_TYPE.AMBUSHER:
                    this.ambushPlayer(player, validDirections);
                    break;
                case ENEMY_TYPE.RANDOM:
                    this.moveRandomly(validDirections);
                    break;
                case ENEMY_TYPE.SHY:
                    this.shyBehavior(player, validDirections);
                    break;
            }
        }
    }

    /**
     * Chase player directly (Chaser behavior)
     * @param {Player} player - Player object
     * @param {Array} validDirections - Array of valid directions
     */
    chasePlayer(player, validDirections) {
        if (validDirections.length === 0) return;
        
        // Find direction that minimizes distance to player
        let bestDirection = validDirections[0];
        let minDistance = Infinity;
        
        validDirections.forEach(dir => {
            const nextPos = {
                x: this.x + dir.x * CELL_SIZE,
                y: this.y + dir.y * CELL_SIZE
            };
            
            const distance = calculateDistance(nextPos, { x: player.x, y: player.y });
            
            if (distance < minDistance) {
                minDistance = distance;
                bestDirection = dir;
            }
        });
        
        this.direction = bestDirection;
    }

    /**
     * Predict player's path and intercept (Ambusher behavior)
     * @param {Player} player - Player object
     * @param {Array} validDirections - Array of valid directions
     */
    ambushPlayer(player, validDirections) {
        if (validDirections.length === 0) return;
        
        // Predict where player will be in a few steps
        const predictedPos = {
            x: player.x + player.direction.x * CELL_SIZE * 4,
            y: player.y + player.direction.y * CELL_SIZE * 4
        };
        
        // Find direction that minimizes distance to predicted position
        let bestDirection = validDirections[0];
        let minDistance = Infinity;
        
        validDirections.forEach(dir => {
            const nextPos = {
                x: this.x + dir.x * CELL_SIZE,
                y: this.y + dir.y * CELL_SIZE
            };
            
            const distance = calculateDistance(nextPos, predictedPos);
            
            if (distance < minDistance) {
                minDistance = distance;
                bestDirection = dir;
            }
        });
        
        this.direction = bestDirection;
    }

    /**
     * Move randomly (Random behavior)
     * @param {Array} validDirections - Array of valid directions
     */
    moveRandomly(validDirections) {
        if (validDirections.length === 0) return;
        
        // 80% chance to keep current direction if valid
        if (this.direction !== DIRECTION.NONE && 
            validDirections.some(dir => dir.x === this.direction.x && dir.y === this.direction.y) &&
            Math.random() < 0.8) {
            return;
        }
        
        // Otherwise choose random direction
        this.direction = getRandomItem(validDirections);
    }

    /**
     * Avoid player unless player is vulnerable (Shy behavior)
     * @param {Player} player - Player object
     * @param {Array} validDirections - Array of valid directions
     */
    shyBehavior(player, validDirections) {
        if (validDirections.length === 0) return;
        
        // Calculate distance to player
        const distanceToPlayer = calculateDistance({ x: this.x, y: this.y }, { x: player.x, y: player.y });
        
        // If player is far away (more than 8 cells), move randomly
        if (distanceToPlayer > CELL_SIZE * 8) {
            this.moveRandomly(validDirections);
            return;
        }
        
        // If player is close, move away from player
        this.fleeFromPlayer(player, validDirections);
    }

    /**
     * Flee from player (used when vulnerable)
     * @param {Player} player - Player object
     * @param {Array} validDirections - Array of valid directions
     */
    fleeFromPlayer(player, validDirections) {
        if (validDirections.length === 0) return;
        
        // Find direction that maximizes distance to player
        let bestDirection = validDirections[0];
        let maxDistance = -Infinity;
        
        validDirections.forEach(dir => {
            const nextPos = {
                x: this.x + dir.x * CELL_SIZE,
                y: this.y + dir.y * CELL_SIZE
            };
            
            const distance = calculateDistance(nextPos, { x: player.x, y: player.y });
            
            if (distance > maxDistance) {
                maxDistance = distance;
                bestDirection = dir;
            }
        });
        
        this.direction = bestDirection;
    }

    /**
     * Find a new direction when current direction is blocked
     * @param {Array} maze - 2D array representing the maze
     * @param {Player} player - Player object
     */
    findNewDirection(maze, player) {
        // Get available directions
        const availableDirections = getAvailableDirections({ x: this.x, y: this.y }, maze);
        
        if (availableDirections.length === 0) return;
        
        // Choose direction based on enemy type
        if (this.vulnerable) {
            this.fleeFromPlayer(player, availableDirections);
        } else {
            switch (this.type) {
                case ENEMY_TYPE.CHASER:
                    this.chasePlayer(player, availableDirections);
                    break;
                case ENEMY_TYPE.AMBUSHER:
                    this.ambushPlayer(player, availableDirections);
                    break;
                case ENEMY_TYPE.RANDOM:
                    this.moveRandomly(availableDirections);
                    break;
                case ENEMY_TYPE.SHY:
                    this.shyBehavior(player, availableDirections);
                    break;
            }
        }
    }

    /**
     * Handle tunnel wrap-around
     * @param {Array} maze - 2D array representing the maze
     */
    handleTunnelWrap(maze) {
        const gridPos = pixelToGrid(this.x, this.y);
        
        // Check if current position is a tunnel
        if (gridPos.x >= 0 && gridPos.x < GRID_WIDTH && 
            gridPos.y >= 0 && gridPos.y < GRID_HEIGHT && 
            maze[gridPos.y][gridPos.x] === CELL_TYPE.TUNNEL) {
            
            // Wrap to the other side of the maze
            if (gridPos.x <= 0 && this.direction === DIRECTION.LEFT) {
                this.x = (GRID_WIDTH - 1) * CELL_SIZE + CELL_SIZE / 2;
            } else if (gridPos.x >= GRID_WIDTH - 1 && this.direction === DIRECTION.RIGHT) {
                this.x = CELL_SIZE / 2;
            } else if (gridPos.y <= 0 && this.direction === DIRECTION.UP) {
                this.y = (GRID_HEIGHT - 1) * CELL_SIZE + CELL_SIZE / 2;
            } else if (gridPos.y >= GRID_HEIGHT - 1 && this.direction === DIRECTION.DOWN) {
                this.y = CELL_SIZE / 2;
            }
        }
    }

    /**
     * Update eye direction based on movement direction
     */
    updateEyeDirection() {
        if (this.direction === DIRECTION.RIGHT) {
            this.eyeDirection = { x: 1, y: 0 };
        } else if (this.direction === DIRECTION.DOWN) {
            this.eyeDirection = { x: 0, y: 1 };
        } else if (this.direction === DIRECTION.LEFT) {
            this.eyeDirection = { x: -1, y: 0 };
        } else if (this.direction === DIRECTION.UP) {
            this.eyeDirection = { x: 0, y: -1 };
        }
    }

    /**
     * Draw enemy on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if (this.eaten) return;

        ctx.save();
        
        // Draw ghost body
        ctx.beginPath();
        
        // Draw semi-circle for top of ghost
        ctx.arc(this.x, this.y, this.size / 2, Math.PI, 0, false);
        
        // Draw wavy bottom of ghost
        const waveHeight = 4;
        const segments = 3;
        const segmentWidth = this.size / segments;
        
        // Start at bottom right of semi-circle
        let startX = this.x + this.size / 2;
        let startY = this.y;
        
        ctx.lineTo(startX, startY + this.size / 2 - waveHeight);
        
        // Draw waves
        for (let i = 0; i < segments; i++) {
            // Draw down wave
            ctx.lineTo(startX - segmentWidth * (i + 0.5), startY + this.size / 2 + waveHeight);
            // Draw up wave (if not the last segment)
            if (i < segments - 1) {
                ctx.lineTo(startX - segmentWidth * (i + 1), startY + this.size / 2 - waveHeight);
            }
        }
        
        // Connect to bottom left of semi-circle
        ctx.lineTo(this.x - this.size / 2, startY);
        
        // Fill ghost body
        if (this.vulnerable) {
            // Flashing effect near end of vulnerability
            const vulnerabilityEndingSoon = player.powerUpTimers[POWER_UP_TYPE.GHOST_VULNERABILITY] && 
                                           (player.powerUpTimers[POWER_UP_TYPE.GHOST_VULNERABILITY]._idleStart + 
                                            player.powerUpTimers[POWER_UP_TYPE.GHOST_VULNERABILITY]._idleTimeout - 
                                            Date.now() < 3000);
            
            if (vulnerabilityEndingSoon && this.animationCounter % 20 < 10) {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = 'var(--vulnerable-enemy)';
            }
        } else {
            ctx.fillStyle = `var(--enemy-${this.color})`;
        }
        ctx.fill();
        
        // Draw eyes (even when vulnerable)
        const eyeRadius = this.size / 6;
        const eyeOffset = this.size / 4;
        
        // Left eye
        ctx.beginPath();
        ctx.arc(this.x - eyeOffset, this.y - eyeOffset / 2, eyeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(this.x + eyeOffset, this.y - eyeOffset / 2, eyeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Draw pupils (only when not vulnerable)
        if (!this.vulnerable) {
            const pupilRadius = eyeRadius / 2;
            const pupilOffset = pupilRadius;
            
            // Left pupil
            ctx.beginPath();
            ctx.arc(
                this.x - eyeOffset + this.eyeDirection.x * pupilOffset, 
                this.y - eyeOffset / 2 + this.eyeDirection.y * pupilOffset, 
                pupilRadius, 0, Math.PI * 2
            );
            ctx.fillStyle = 'black';
            ctx.fill();
            
            // Right pupil
            ctx.beginPath();
            ctx.arc(
                this.x + eyeOffset + this.eyeDirection.x * pupilOffset, 
                this.y - eyeOffset / 2 + this.eyeDirection.y * pupilOffset, 
                pupilRadius, 0, Math.PI * 2
            );
            ctx.fillStyle = 'black';
            ctx.fill();
        } else {
            // Draw vulnerable face (two lines for eyes)
            const mouthWidth = this.size / 3;
            const mouthHeight = this.size / 6;
            
            // Eyes when vulnerable
            ctx.beginPath();
            ctx.moveTo(this.x - eyeOffset - eyeRadius / 2, this.y - eyeOffset / 2 - eyeRadius / 2);
            ctx.lineTo(this.x - eyeOffset + eyeRadius / 2, this.y - eyeOffset / 2 + eyeRadius / 2);
            ctx.moveTo(this.x - eyeOffset + eyeRadius / 2, this.y - eyeOffset / 2 - eyeRadius / 2);
            ctx.lineTo(this.x - eyeOffset - eyeRadius / 2, this.y - eyeOffset / 2 + eyeRadius / 2);
            
            ctx.moveTo(this.x + eyeOffset - eyeRadius / 2, this.y - eyeOffset / 2 - eyeRadius / 2);
            ctx.lineTo(this.x + eyeOffset + eyeRadius / 2, this.y - eyeOffset / 2 + eyeRadius / 2);
            ctx.moveTo(this.x + eyeOffset + eyeRadius / 2, this.y - eyeOffset / 2 - eyeRadius / 2);
            ctx.lineTo(this.x + eyeOffset - eyeRadius / 2, this.y - eyeOffset / 2 + eyeRadius / 2);
            
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Mouth when vulnerable
            ctx.beginPath();
            ctx.moveTo(this.x - mouthWidth / 2, this.y + mouthHeight);
            ctx.lineTo(this.x + mouthWidth / 2, this.y + mouthHeight);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
    }

    /**
     * Make enemy vulnerable
     * @param {number} duration - Duration of vulnerability in milliseconds
     */
    makeVulnerable(duration) {
        this.vulnerable = true;
        this.speed = this.baseSpeed * 0.5; // Slower when vulnerable
        
        // Clear existing timer if any
        if (this.vulnerableTimer) {
            clearTimeout(this.vulnerableTimer);
        }
        
        // Set timer to end vulnerability
        this.vulnerableTimer = setTimeout(() => {
            this.vulnerable = false;
            this.speed = this.baseSpeed;
        }, duration);
    }

    /**
     * Mark enemy as eaten and start respawn timer
     * @param {number} respawnTime - Time until respawn in milliseconds
     * @param {number} spawnX - Respawn X position
     * @param {number} spawnY - Respawn Y position
     */
    getEaten(respawnTime, spawnX, spawnY) {
        this.eaten = true;
        this.vulnerable = false;
        
        // Clear existing timer if any
        if (this.respawnTimer) {
            clearTimeout(this.respawnTimer);
        }
        
        // Set timer to respawn
        this.respawnTimer = setTimeout(() => {
            this.x = spawnX;
            this.y = spawnY;
            this.direction = DIRECTION.NONE;
            this.eaten = false;
            this.speed = this.baseSpeed;
        }, respawnTime);
    }

    /**
     * Reset enemy to initial position
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     */
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.direction = DIRECTION.NONE;
        this.vulnerable = false;
        this.eaten = false;
        this.speed = this.baseSpeed;
        
        // Clear timers
        if (this.vulnerableTimer) {
            clearTimeout(this.vulnerableTimer);
            this.vulnerableTimer = null;
        }
        
        if (this.respawnTimer) {
            clearTimeout(this.respawnTimer);
            this.respawnTimer = null;
        }
    }
}
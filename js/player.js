/**
 * Player (Pac-Mon) Class
 */

class Player {
    /**
     * Create a new player
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {number} speed - Player movement speed
     */
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.baseSpeed = speed;
        this.speed = speed;
        this.direction = DIRECTION.NONE;
        this.nextDirection = DIRECTION.NONE;
        this.angle = 0; // Angle for rotation
        this.mouthOpen = true; // For chomping animation
        this.mouthAngle = 0.2; // Mouth opening angle
        this.animationCounter = 0; // For controlling animation speed
        this.size = CELL_SIZE - 2; // Slightly smaller than cell
        this.alive = true;
        this.lives = 3;
        this.powerUps = {
            ghostVulnerability: false,
            speedBoost: false,
            shield: false
        };
        this.powerUpTimers = {
            ghostVulnerability: null,
            speedBoost: null,
            shield: null
        };
    }

    /**
     * Update player position and state
     * @param {Array} maze - 2D array representing the maze
     */
    update(maze) {
        if (!this.alive) return;

        // Try to change direction if a new direction is queued
        if (this.nextDirection !== DIRECTION.NONE) {
            if (isValidMove({ x: this.x, y: this.y }, this.nextDirection, maze)) {
                this.direction = this.nextDirection;
                this.nextDirection = DIRECTION.NONE;
            }
        }

        // Move in current direction if valid
        if (this.direction !== DIRECTION.NONE && 
            isValidMove({ x: this.x, y: this.y }, this.direction, maze)) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;

            // Handle tunnel wrap-around
            this.handleTunnelWrap(maze);
        }

        // Update animation
        this.updateAnimation();

        // Update angle based on direction
        this.updateAngle();
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
     * Update player animation
     */
    updateAnimation() {
        // Only animate if moving
        if (this.direction !== DIRECTION.NONE) {
            this.animationCounter++;
            
            // Change mouth state every 5 frames
            if (this.animationCounter >= 5) {
                this.mouthOpen = !this.mouthOpen;
                this.animationCounter = 0;
            }
        }
    }

    /**
     * Update player angle based on direction
     */
    updateAngle() {
        if (this.direction === DIRECTION.RIGHT) {
            this.angle = 0;
        } else if (this.direction === DIRECTION.DOWN) {
            this.angle = Math.PI / 2;
        } else if (this.direction === DIRECTION.LEFT) {
            this.angle = Math.PI;
        } else if (this.direction === DIRECTION.UP) {
            this.angle = Math.PI * 3 / 2;
        }
    }

    /**
     * Draw player on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw Pac-Mon
        ctx.beginPath();
        if (this.mouthOpen) {
            ctx.arc(0, 0, this.size / 2, this.mouthAngle, Math.PI * 2 - this.mouthAngle);
        } else {
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        }
        ctx.lineTo(0, 0);
        ctx.fillStyle = this.powerUps.shield ? 'rgba(0, 255, 255, 0.7)' : 'var(--player-color)';
        ctx.fill();
        
        ctx.restore();

        // Draw shield effect if active
        if (this.powerUps.shield) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2 + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    /**
     * Set player direction
     * @param {Object} direction - Direction to move
     */
    setDirection(direction) {
        this.nextDirection = direction;
    }

    /**
     * Reset player to initial position
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     */
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.direction = DIRECTION.NONE;
        this.nextDirection = DIRECTION.NONE;
        this.alive = true;
        this.clearPowerUps();
    }

    /**
     * Kill player and reduce lives
     * @returns {boolean} - True if player has lives left
     */
    die() {
        // If shield is active, don't die
        if (this.powerUps.shield) return true;

        this.alive = false;
        this.lives--;
        return this.lives > 0;
    }

    /**
     * Activate a power-up
     * @param {string} type - Type of power-up
     */
    activatePowerUp(type) {
        this.powerUps[type] = true;
        
        // Clear existing timer if any
        if (this.powerUpTimers[type]) {
            clearTimeout(this.powerUpTimers[type]);
        }
        
        // Apply power-up effect
        if (type === POWER_UP_TYPE.SPEED_BOOST) {
            this.speed = this.baseSpeed * 1.5;
        }
        
        // Set timer to deactivate power-up
        this.powerUpTimers[type] = setTimeout(() => {
            this.deactivatePowerUp(type);
        }, POWER_UP_DURATION[type]);
    }

    /**
     * Deactivate a power-up
     * @param {string} type - Type of power-up
     */
    deactivatePowerUp(type) {
        this.powerUps[type] = false;
        
        // Reset speed if speed boost is deactivated
        if (type === POWER_UP_TYPE.SPEED_BOOST) {
            this.speed = this.baseSpeed;
        }
        
        this.powerUpTimers[type] = null;
    }

    /**
     * Clear all active power-ups
     */
    clearPowerUps() {
        // Clear all power-ups
        Object.keys(this.powerUps).forEach(type => {
            this.powerUps[type] = false;
            if (this.powerUpTimers[type]) {
                clearTimeout(this.powerUpTimers[type]);
                this.powerUpTimers[type] = null;
            }
        });
        
        // Reset speed
        this.speed = this.baseSpeed;
    }

    /**
     * Check if player has a specific power-up active
     * @param {string} type - Type of power-up
     * @returns {boolean} - True if power-up is active
     */
    hasPowerUp(type) {
        return this.powerUps[type];
    }
}
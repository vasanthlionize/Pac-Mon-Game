/**
 * Power-ups Manager
 */

class PowerUpManager {
    /**
     * Create a new power-up manager
     */
    constructor() {
        this.activePowerUps = [];
        this.powerUpTimers = {};
        this.animationCounter = 0;
    }

    /**
     * Update power-ups animation
     */
    update() {
        this.animationCounter++;
    }

    /**
     * Activate a power-up
     * @param {string} type - Type of power-up
     * @param {Player} player - Player object
     * @param {Array} enemies - Array of enemy objects
     */
    activatePowerUp(type, player, enemies) {
        // Apply power-up effect based on type
        switch (type) {
            case POWER_UP_TYPE.GHOST_VULNERABILITY:
                this.activateGhostVulnerability(player, enemies);
                break;
            case POWER_UP_TYPE.SPEED_BOOST:
                this.activateSpeedBoost(player);
                break;
            case POWER_UP_TYPE.SHIELD:
                this.activateShield(player);
                break;
            case POWER_UP_TYPE.BONUS_FRUIT:
                // Bonus fruit is handled directly in the game class
                break;
        }
        
        // Add to active power-ups
        if (!this.activePowerUps.includes(type)) {
            this.activePowerUps.push(type);
        }
        
        // Play power-up sound
        audioManager.play('powerUp');
    }

    /**
     * Activate ghost vulnerability power-up
     * @param {Player} player - Player object
     * @param {Array} enemies - Array of enemy objects
     */
    activateGhostVulnerability(player, enemies) {
        // Make player able to eat ghosts
        player.activatePowerUp(POWER_UP_TYPE.GHOST_VULNERABILITY);
        
        // Make all enemies vulnerable
        enemies.forEach(enemy => {
            enemy.makeVulnerable(POWER_UP_DURATION.GHOST_VULNERABILITY);
        });
    }

    /**
     * Activate speed boost power-up
     * @param {Player} player - Player object
     */
    activateSpeedBoost(player) {
        player.activatePowerUp(POWER_UP_TYPE.SPEED_BOOST);
    }

    /**
     * Activate shield power-up
     * @param {Player} player - Player object
     */
    activateShield(player) {
        player.activatePowerUp(POWER_UP_TYPE.SHIELD);
    }

    /**
     * Check if a power-up is active
     * @param {string} type - Type of power-up
     * @param {Player} player - Player object
     * @returns {boolean} - True if power-up is active
     */
    isPowerUpActive(type, player) {
        return player.hasPowerUp(type);
    }

    /**
     * Clear all active power-ups
     * @param {Player} player - Player object
     * @param {Array} enemies - Array of enemy objects
     */
    clearAllPowerUps(player, enemies) {
        player.clearPowerUps();
        
        enemies.forEach(enemy => {
            enemy.vulnerable = false;
            enemy.speed = enemy.baseSpeed;
        });
        
        this.activePowerUps = [];
    }

    /**
     * Draw power-up effects on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        // This method can be used to draw additional power-up effects
        // For example, a pulsing overlay when a power-up is active
        
        // For now, we'll leave it empty as the effects are drawn by the player and enemies
    }
}
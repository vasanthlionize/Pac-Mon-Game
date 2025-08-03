/**
 * Audio Manager
 */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        this.loadSounds();
    }

    /**
     * Load all game sounds
     */
    loadSounds() {
        // Create audio elements
        this.sounds = {
            chomp: new Audio('./assets/sounds/chomp.mp3'),
            powerUp: new Audio('./assets/sounds/power-up.mp3'),
            ghostEaten: new Audio('./assets/sounds/ghost-eaten.mp3'),
            death: new Audio('./assets/sounds/death.mp3'),
            fruit: new Audio('./assets/sounds/fruit.mp3'),
            levelUp: new Audio('./assets/sounds/level-up.mp3'),
            gameStart: new Audio('./assets/sounds/game-start.mp3'),
            gameOver: new Audio('./assets/sounds/game-over.mp3')
        };

        // Set volume for all sounds
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.5;
        });
    }

    /**
     * Play a sound
     * @param {string} soundName - Name of the sound to play
     */
    play(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        // Reset sound to beginning if it's already playing
        this.sounds[soundName].currentTime = 0;
        this.sounds[soundName].play().catch(error => {
            console.error(`Error playing sound ${soundName}:`, error);
        });
    }

    /**
     * Toggle sound on/off
     * @returns {boolean} - New mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    /**
     * Set mute state
     * @param {boolean} muted - Mute state
     */
    setMute(muted) {
        this.isMuted = muted;
    }

    /**
     * Check if sound is muted
     * @returns {boolean} - Mute state
     */
    isSoundMuted() {
        return this.isMuted;
    }
}

// Create global audio manager instance
const audioManager = new AudioManager();
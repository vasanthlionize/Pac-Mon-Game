/**
 * Game Constants
 */

// Game Settings
const CELL_SIZE = 20; // Size of each cell in pixels
const GRID_WIDTH = 28; // Number of cells horizontally
const GRID_HEIGHT = 31; // Number of cells vertically
const FPS = 60; // Frames per second

// Game Speeds
const SPEED = {
    EASY: {
        PLAYER: 2,
        ENEMY: 1.5,
        ENEMY_VULNERABLE: 1
    },
    MEDIUM: {
        PLAYER: 3,
        ENEMY: 2.5,
        ENEMY_VULNERABLE: 1.5
    },
    HARD: {
        PLAYER: 4,
        ENEMY: 3.5,
        ENEMY_VULNERABLE: 2
    }
};

// Game States
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Direction Constants
const DIRECTION = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
    NONE: { x: 0, y: 0 }
};

// Key Mappings
const KEY_MAPPINGS = {
    ARROWS: {
        38: DIRECTION.UP,    // Up Arrow
        40: DIRECTION.DOWN,  // Down Arrow
        37: DIRECTION.LEFT,  // Left Arrow
        39: DIRECTION.RIGHT  // Right Arrow
    },
    WASD: {
        87: DIRECTION.UP,    // W
        83: DIRECTION.DOWN,  // S
        65: DIRECTION.LEFT,  // A
        68: DIRECTION.RIGHT  // D
    }
};

// Cell Types
const CELL_TYPE = {
    EMPTY: 0,
    WALL: 1,
    DOT: 2,
    POWER_PELLET: 3,
    TUNNEL: 4,
    ENEMY_SPAWN: 5,
    PLAYER_SPAWN: 6
};

// Power-up Types
const POWER_UP_TYPE = {
    GHOST_VULNERABILITY: 'ghostVulnerability',
    SPEED_BOOST: 'speedBoost',
    SHIELD: 'shield',
    BONUS_FRUIT: 'bonusFruit'
};

// Power-up Durations (in milliseconds)
const POWER_UP_DURATION = {
    GHOST_VULNERABILITY: 10000, // 10 seconds
    SPEED_BOOST: 5000,         // 5 seconds
    SHIELD: 10000              // 10 seconds
};

// Score Values
const SCORE = {
    DOT: 1,
    POWER_UP: 10,
    GHOST: 50,
    FRUIT: 100,
    LEVEL_CLEAR: 500
};

// Enemy Types
const ENEMY_TYPE = {
    CHASER: 'chaser',
    AMBUSHER: 'ambusher',
    RANDOM: 'random',
    SHY: 'shy'
};

// Enemy Colors
const ENEMY_COLOR = {
    CHASER: 'red',
    AMBUSHER: 'blue',
    RANDOM: 'purple',
    SHY: 'green',
    VULNERABLE: 'vulnerable'
};

// Game Difficulty
const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

// Theme Types
const THEME = {
    CLASSIC: 'classic',
    NEON: 'neon',
    RETRO: 'retro'
};

// Control Types
const CONTROLS = {
    ARROWS: 'arrows',
    WASD: 'wasd'
};
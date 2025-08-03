# Pac-Mon Game

## Overview
Pac-Mon is a modern, browser-based arcade game inspired by the classic Pac-Man. The player controls a character ("Pac-Mon") who navigates a maze, eats dots (called mon-bits), avoids enemies (called glitch-monsters), and collects power-ups to gain temporary advantages.

## Features

### Player Mechanics
- Arrow key or WASD movement
- Constant motion (player always moving unless hitting wall)
- Animating Pac-Mon chomp effect
- 3 lives per game
- Speed increases with level

### Maze System
- Grid-based maze layout
- Walls that block Pac-Mon and ghosts
- Tunnels for wrap-around teleport
- Dots to collect (score +1)
- Power-pellets for ghost vulnerability (score +10)

### Enemies (Glitch-Monsters)
- 4 AI-controlled ghosts with unique behaviors:
  - Chaser: Always tries to follow Pac-Mon
  - Ambusher: Predicts Pac-Mon's path
  - Random: Moves randomly
  - Shy: Avoids Pac-Mon until power-up ends

### Power-Ups
- Temporary ghost vulnerability (ghosts turn blue and can be eaten)
- Speed boost
- Shield (immune to ghosts for 10 seconds)
- Bonus fruit (score multiplier)

### Scoring System
- Dot = +1
- Power-up = +10
- Ghost eaten = +50
- Fruit = +100
- Level clear = +500

### Levels & Difficulty
- Infinite levels with growing speed and ghost count
- Every level resets map with added challenge
- Leaderboard using localStorage

## Game Options
- Start Game
- Sound ON/OFF
- Difficulty: Easy / Medium / Hard
- Controls: Arrow Keys / WASD
- Theme switch: Classic (black) / Neon / Retro Pixel

## Visual Design
- Style: Neon-glow + retro pixel art
- Color Palette:
  - Maze: Dark blue / black
  - Dots: Yellow
  - Pac-Mon: Bright yellow (classic)
  - Enemies: Red, Blue, Purple, Green (distinct and animated)
  - Power-ups: Shiny or blinking icons

## How to Play
1. Open `index.html` in a web browser
2. Select your preferred options in the menu
3. Click "Start Game" to begin
4. Use arrow keys or WASD to navigate the maze
5. Collect all dots to advance to the next level
6. Avoid ghosts unless you have a power-up active
7. Try to achieve the highest score possible!

## Installation
1. Clone this repository
2. Open `index.html` in a web browser

## Technologies Used
- HTML5
- CSS3
- JavaScript

## Credits
Developed as a modern take on the classic Pac-Man game.
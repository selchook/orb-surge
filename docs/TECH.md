# Orb Surge - Technical Architecture Document

## 1. Engine Choice: Phaser 3 (rationale)

**Phaser 3** selected for:
- **Physics Integration**: Built-in Matter.js physics perfect for magnetic orb mechanics
- **Particle Systems**: Native particle emitters for energy trails and collection effects
- **Performance**: Optimized WebGL renderer handles 60+ orbs with particles smoothly
- **Input Unification**: Single API handles mouse, touch, and keyboard seamlessly
- **Bundle Size**: Core framework ~800KB gzipped, fits within mobile budget
- **Audio**: Web Audio API integration with built-in sound management
- **CrazyGames Compatibility**: Proven stable across Chrome/Edge/Chromebook

## 2. Project File Structure

```
src/
├── main.js                 # Entry point, Phaser config, CrazyGames SDK init
├── scenes/
│   ├── BootScene.js        # SDK init, procedural asset generation
│   ├── LoadScene.js        # Progress bar, asset loading
│   ├── MenuScene.js        # Main menu, settings
│   ├── GameScene.js        # Core gameplay loop
│   └── GameOverScene.js    # Results, restart
├── entities/
│   ├── PlayerOrb.js        # Magnetic launch orb
│   ├── EnergyParticle.js   # Collectible targets
│   └── Hazard.js           # Electromagnetic obstacles
├── systems/
│   ├── InputSystem.js      # Unified input handling
│   ├── AudioSystem.js      # CrazyGames-compliant audio
│   ├── UISystem.js         # HUD, score display
│   └── PhysicsSystem.js    # Magnetic field calculations
├── utils/
│   ├── GameState.js        # State machine
│   ├── ProceduralAssets.js # Runtime graphic generation
│   └── CrazyGamesSDK.js    # SDK wrapper
└── config/
    └── GameConfig.js       # Constants, tuning values
```

## 3. Scene Architecture (Boot→Load→Menu→Game→GameOver)

**BootScene**: 
- Initialize CrazyGames SDK
- Generate procedural graphics (orbs, particles, UI elements)
- Create audio buffers using Web Audio API
- 2-3 second duration maximum

**LoadScene**:
- `SDK.game.loadingStart()` call
- Animated progress bar (fake progress for procedural assets)
- Preload any remaining audio samples
- `SDK.game.loadingStop()` before transitioning

**MenuScene**:
- Background particle animation (low-intensity preview)
- Play button (large, touch-friendly)
- Settings toggle (audio on/off respecting SDK.settings.muteAudio)
- How to Play overlay (visual-first onboarding)

**GameScene**:
- `SDK.game.gameplayStart()` on first orb launch
- Real-time physics simulation
- Particle effects for magnetism
- Score multiplier system
- Level progression (increasing difficulty)
- `SDK.game.gameplayStop()` on game over

**GameOverScene**:
- Score display with personal best
- `SDK.game.happytime()` on new high score only
- Restart button (immediate return to GameScene)
- Menu button option

## 4. Game State Machine (exact enum names)

```javascript
const GameState = {
  MENU: 'menu',
  AIMING: 'aiming',
  LAUNCHING: 'launching',
  PHYSICS_ACTIVE: 'physics_active',
  COLLECTING: 'collecting',
  LEVEL_COMPLETE: 'level_complete',
  GAME_OVER: 'game_over',
  PAUSED: 'paused'
};
```

## 5. Entity & Component Design

**PlayerOrb**:
- Matter.js rigid body (circle)
- Magnetic field component (affects nearby particles)
- Trail particle emitter
- Launch trajectory calculation

**EnergyParticle**:
- Physics body with attraction to player orb
- Collection detection (
# Orb Surge - Implementation Specification

## 1. File Map

```
src/
├── main.js                     // Phaser game config and scene registration
├── scenes/
│   ├── BootScene.js           // Initial loading and CrazyGames SDK initialization
│   ├── LoadScene.js           // Asset generation and progress display
│   ├── MenuScene.js           // Main menu with play button and settings
│   ├── GameScene.js           // Core gameplay loop with orb mechanics
│   └── GameOverScene.js       // Score display and restart options
├── entities/
│   ├── PlayerOrb.js           // Player-controlled magnetic orb with growth mechanics
│   ├── EnergyParticle.js      // Collectible particles with attraction physics
│   └── Hazard.js              // Moving obstacles that shrink player on contact
├── systems/
│   ├── InputSystem.js         // Unified mouse/touch/keyboard input handling
│   ├── AudioSystem.js         // Web Audio synth engine for procedural sounds
│   ├── UISystem.js            // HUD elements and menu interface management
│   ├── PhysicsSystem.js       // Custom magnetic field and collision detection
│   ├── GameState.js           // Global state management and persistence
│   └── ProceduralAssets.js    // Canvas-based sprite and texture generation
└── integrations/
    └── CrazyGamesSDK.js       // SDK wrapper for ad triggers and analytics
```

## 2. Scene Lifecycle

```
BootScene.create():
  - CrazyGamesSDK.init()
  - SDK.emit('game.loadingStart')
  - scene.start('LoadScene')

LoadScene.create():
  - ProceduralAssets.generateAll() 
  - AudioSystem.initSynth()
  - GameState.loadProgress()
  - SDK.emit('game.loadingStop')
  - scene.start('MenuScene')

MenuScene (user clicks play):
  - SDK.emit('game.gameplayStart')
  - scene.start('GameScene')

GameScene (player dies):
  - SDK.emit('game.gameplayStop')
  - scene.start('GameOverScene')

GameOverScene (restart clicked):
  - SDK.emit('game.gameplayStart')
  - scene.start('GameScene')
```

## 3. Entities & Classes

### PlayerOrb
```javascript
class PlayerOrb extends Phaser.GameObjects.Arc {
  properties: {
    radius: 20,
    mass: 100,
    magneticField: 150,
    velocity: { x: 0, y: 0 },
    energy: 100,
    isDead: false
  }
  
  methods: {
    update(delta) // Apply magnetic forces, update particles trail
    grow(amount) // Increase radius and magnetic field strength  
    shrink(amount) // Decrease size, trigger death if radius < 5
    attractParticles(particles) // Pull nearby EnergyParticles
    die() // Emit death particles, trigger game over
  }
}
```

### EnergyParticle  
```javascript
class EnergyParticle extends Phaser.GameObjects.Arc {
  properties: {
    radius: 3,
    lifespan: 10000,
    attractionForce: 50,
    energyValue: 10,
    isCollected: false,
    glowTween: Phaser.Tween
  }
  
  methods: {
    update(playerOrb) // Move toward player based on magnetic field
    collect() // Trigger collection animation and audio
    expire() // Natural despawn after lifespan
  }
}
```

### Hazard
```javascript
class Hazard extends Phaser.GameObjects.Graphics {
  properties: {
    type: 'SPIKE'|'VOID'|'ELECTRIC',
    bounds: Rectangle,
    damage: 25,
    movePattern: 'LINEAR'|'CIRCULAR'|'RANDOM',
    speed: 100,
    isActive:
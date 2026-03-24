# GAME ERROR REFERENCE GUIDE
*For Phaser 3 + CrazyGames SDK + Vite*

---

## 1. NPM INSTALL / VITE BUILD ERRORS

### `npm install` fails
```bash
# Clear cache first
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# If peer dependency warnings
npm install --legacy-peer-deps
```

### Vite build fails - missing dependencies
```bash
npm install phaser @crazygames/sdk
npm install -D vite @vitejs/plugin-legacy
```

### TypeScript errors in build
```js
// vite.config.js - disable type checking
export default {
  build: {
    rollupOptions: {
      onwarn: () => {} // Suppress warnings
    }
  }
}
```

---

## 2. PHASER 3 ENGINE ERRORS

### Cannot import Phaser
```js
// ❌ Wrong
import Phaser from 'phaser'

// ✅ Correct
import * as Phaser from 'phaser'
// OR
import { Game, Scene, AUTO } from 'phaser'
```

### Game config errors
```js
// ✅ Minimal working config
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container', // Must exist in HTML
  scene: [MenuScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 } }
  }
}
```

### Scene not loading
```js
// ✅ Proper scene structure
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }
  
  preload() {
    // Load assets here
  }
  
  create() {
    // Initialize game objects
  }
}
```

---

## 3. CRAZYGAMES SDK ERRORS

### SDK init fails
```js
// ✅ Proper initialization
import { CrazyGames } from '@crazygames/sdk'

// In game init
try {
  await CrazyGames.init()
  console.log('CrazyGames SDK ready')
} catch (error) {
  console.warn('CrazyGames not available:', error)
  // Continue without SDK
}
```

### Environment not enabled
```js
// ✅ Check environment first
const isProduction = window.location.hostname !== 'localhost'

if (isProduction) {
  try {
    await CrazyGames.init()
  } catch (e) {
    console.warn('SDK not available')
  }
}
```

### Ad errors
```js
// ✅ Safe ad implementation
async showRewardedAd() {
  try {
    await CrazyGames.ad.requestAd('rewarded')
    // Give reward
  } catch (error) {
    console.log('Ad failed, giving reward anyway')
    // Always give reward on ad failure
  }
}
```

---

## 4. CANVAS/WEBGL CONTEXT ERRORS

### WebGL context lost
```js
// ✅ Handle context loss
const config = {
  type: Phaser.AUTO,
  canvas: document.getElementById('game-canvas'),
  callbacks: {
    postBoot: (game) => {
      game.canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault()
        console.log('WebGL context lost')
      })
      
      game.canvas.addEventListener('webglcontextrestored', () => {
        console.log('WebGL context restored')
        // Reload textures if needed
      })
    }
  }
}
```

### Canvas size issues
```js
// ✅ Responsive canvas
const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.
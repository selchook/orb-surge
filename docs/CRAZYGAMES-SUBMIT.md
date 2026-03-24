# CrazyGames Submission Guide for Orb Surge

## 1. Account Setup

- Visit [developer.crazygames.com](https://developer.crazygames.com) and create a developer account
- Complete your developer profile with company information and tax details
- Verify your email address and agree to the Developer Agreement
- Set up payment information for revenue sharing (70% developer, 30% CrazyGames)

## 2. Pre-submission Checklist

### Technical Requirements
- [ ] Game runs smoothly at 60fps on low-end devices
- [ ] No console errors or warnings
- [ ] Responsive design supporting 16:9, 4:3, and mobile aspect ratios
- [ ] HTTPS hosting with valid SSL certificate
- [ ] No external dependencies or CDN links
- [ ] Preloader shows progress (0-100%)
- [ ] Game fits within 800x600 minimum viewport
- [ ] Touch controls work on mobile devices
- [ ] Audio can be muted/unmuted
- [ ] Fullscreen toggle functionality

### Content Requirements
- [ ] No copyrighted music, images, or assets without permission
- [ ] Family-friendly content (no violence, explicit language, or adult themes)
- [ ] Game is fully functional and bug-free
- [ ] Clear win/lose conditions and scoring system
- [ ] Tutorial or instructions accessible within game

## 3. SDK Integration Verification Steps

### CrazyGames SDK Implementation
```javascript
// Initialize SDK
window.CrazyGames.SDK.init().then(() => {
    console.log('CrazyGames SDK initialized');
}).catch((error) => {
    console.error('SDK initialization failed:', error);
});

// Test required functions
window.CrazyGames.SDK.game.gameplayStart();
window.CrazyGames.SDK.game.gameplayStop();
window.CrazyGames.SDK.game.happytime();
```

### Verification Checklist
- [ ] SDK loads without errors
- [ ] `gameplayStart()` called when game begins
- [ ] `gameplayStop()` called during menus/pause
- [ ] `happytime()` called during positive moments (level complete, high score)
- [ ] Ad placement hooks ready (even if ads not active in basic launch)

## 4. Bundle Size Optimization (Target ≤20MB Initial)

### Compression Strategies
- Use WebP images with PNG fallbacks
- Compress audio files to OGG/MP3 at 96-128kbps
- Minify and compress JavaScript/CSS files
- Use texture atlases to reduce HTTP requests
- Enable GZIP compression on server

### Phaser 3 Specific Optimizations
```javascript
// Use custom builds to reduce bundle size
const config = {
    type: Phaser.WEBGL,
    parent: 'game-container',
    physics: {
        default: 'matter', // Only include physics engine you need
        matter: {
            enableSleeping: true // Optimize physics performance
        }
    }
};
```

- [ ] Bundle size under 20MB
- [ ] Initial load under 5MB
- [ ] Lazy load non-essential assets
- [ ] Use asset streaming for larger games

## 5. Game Cover Images Required

### Thumbnail (280x280px)
- Clean, readable game logo
- Bright, eye-catching colors
- No text smaller than 14px
- PNG format, under 200KB

### Banner (1900x1200px)
- Showcase key gameplay elements
- Include game title prominently
- Maintain visual consistency with thumbnail
- PNG/JPG format, under 500KB

### Additional Assets
- Favicon (32x32px)
- Screenshots (1280x720px minimum) - 3-5 gameplay images
- Optional: GIF preview (under 2MB, 10-15 seconds)

## 6. Categories & Tags Selection

### Primary Category for Orb Surge
- **Puzzle** (primary)
- **Arcade** (secondary)

### Relevant Tags
- physics
- puzzle
- arcade
- casual
- orb
- magnetic
- strategy
- brain
- addictive
- skill

### Tag Strategy
- Use 8-12
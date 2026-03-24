# Verify & Fix Report — 2026-03-24 22:10:25 UTC
_(check-only — rerun with --fix to auto-fix)_

## ✅ Passing (40)
- File exists: index.html
- File exists: package.json
- File exists: vite.config.ts
- File exists: tsconfig.json
- File exists: src/main.ts
- File exists: src/config/deploy.ts
- File exists: src/scenes/MenuScene.ts
- File exists: src/scenes/GameScene.ts
- File exists: src/scenes/GameOverScene.ts
- File exists: src/utils/CrazyGamesSDK.ts
- File exists: src/types/index.ts
- phaser in dependencies
- vite in devDependencies
- typescript in devDependencies
- scripts use vite (not webpack)
- No webpack in devDependencies
- No webpack-cli in devDependencies
- No webpack-dev-server in devDependencies
- No stale dep: pixi.js
- No stale dep: howler
- No stale dep: @vitejs/plugin-legacy
- vite.config.ts: no broken reference to 'pixi.js'
- vite.config.ts: no broken reference to 'howler'
- vite.config.ts: no broken reference to 'plugin-legacy'
- vite.config.ts: no broken reference to 'terser'
- vite.config.ts: has base: "./"
- No duplicate vite.config.js
- index.html: entry point is /src/main.ts
- index.html: no hardcoded CrazyGames SDK script (managed via deploy.ts)
- index.html: user-select:none present
- deploy.ts: DEPLOY_TARGET is 'crazygames' or 'web'
- main.ts: MenuScene registered
- main.ts: GameScene registered
- main.ts: GameOverScene registered
- main.ts: imports DEPLOY_TARGET from config/deploy
- main.ts: conditionally injects CrazyGames SDK
- MenuScene.ts: has createBackgroundParticles()
- MenuScene.ts: has startGame()
- MenuScene.ts: CrazyGamesSDK.init() called
- TypeScript: zero type errors

## 🔧 Auto-Fixed (0)
- none

## ❌ Remaining Issues (0)
- none

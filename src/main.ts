import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { onPlatform } from './ayvago/platform';

function hideLoadingScreen(): void {
  const screen = document.getElementById('loading-screen');
  if (screen) screen.style.display = 'none';
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  scene: [MenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  callbacks: {
    postBoot: hideLoadingScreen,
  },
};

const game = new Phaser.Game(config);

// Inside Ayvago the platform pauses the game when its tab is hidden and can mute it.
onPlatform((platform) => {
  platform.onPause(() => game.loop.sleep());
  platform.onResume(() => game.loop.wake());
  platform.onMute((muted) => {
    game.sound.mute = muted;
  });
});

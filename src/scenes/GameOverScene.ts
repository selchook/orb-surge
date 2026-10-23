import Phaser from 'phaser';
import { onPlatform } from '../ayvago/platform';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number }): void {
    const { width, height } = this.cameras.main;
    const score = data?.score ?? 0;
    const highScore = parseInt(localStorage.getItem('orbSurgeHighScore') || '0');
    const isNewBest = score >= highScore && score > 0;

    this.add.rectangle(width / 2, height / 2, width, height, 0x080818);

    this.add.text(width / 2, height / 3 - 50, 'GAME OVER', {
      fontSize: '52px',
      fontFamily: 'Arial',
      color: '#ff2244',
      stroke: '#880011',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 50, `Score: ${score}`, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
    }).setOrigin(0.5);

    const bestColor = isNewBest ? '#ffdd00' : '#888888';
    const bestLabel = isNewBest ? `NEW BEST: ${highScore}` : `Best: ${highScore}`;
    this.add.text(width / 2, height / 2 - 10, bestLabel, {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: bestColor,
    }).setOrigin(0.5);

    // Play Again button
    const restartBtn = this.add.text(width / 2, height / 2 + 70, 'PLAY AGAIN', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#00d4ff',
      padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartBtn.on('pointerdown', () => {
      onPlatform((p) => p.gameplayStart());
      this.scene.start('GameScene');
    });
    restartBtn.on('pointerover', () => restartBtn.setStyle({ backgroundColor: '#0099cc' }));
    restartBtn.on('pointerout', () => restartBtn.setStyle({ backgroundColor: '#00d4ff' }));

    // Main Menu button
    const menuBtn = this.add.text(width / 2, height / 2 + 145, 'MAIN MENU', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#aaaaaa',
      backgroundColor: '#222233',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    menuBtn.on('pointerover', () => menuBtn.setStyle({ backgroundColor: '#444455' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ backgroundColor: '#222233' }));

    // R key shortcut
    this.input.keyboard!.on('keydown-R', () => {
      onPlatform((p) => p.gameplayStart());
      this.scene.start('GameScene');
    });
  }
}

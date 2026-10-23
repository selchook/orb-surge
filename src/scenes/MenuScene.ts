import Phaser from 'phaser';
import { onPlatform } from '../ayvago/platform';

export class MenuScene extends Phaser.Scene {
  private particles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  private title!: Phaser.GameObjects.Text;
  private playButton!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background gradient effect
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Create animated orb particles in background
    this.createBackgroundParticles();

    // Title
    this.title = this.add.text(width / 2, height / 3, 'ORB SURGE', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#00d4ff',
      stroke: '#0099cc',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Animate title
    this.tweens.add({
      targets: this.title,
      scale: { from: 1, to: 1.1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Play button
    this.playButton = this.add.text(width / 2, height / 2 + 50, 'PLAY', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#00d4ff',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => {
        this.playButton.setScale(1.1);
        this.playButton.setStyle({ backgroundColor: '#0099cc' });
      })
      .on('pointerout', () => {
        this.playButton.setScale(1);
        this.playButton.setStyle({ backgroundColor: '#00d4ff' });
      });

    // High score
    const highScore = localStorage.getItem('orbSurgeHighScore') || '0';
    this.highScoreText = this.add.text(width / 2, height / 2 + 120, `High Score: ${highScore}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#cccccc'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(width / 2, height - 100, 'Click to collect orbs • Avoid red orbs • Get power-ups!', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0.5);
  }

  private createBackgroundParticles(): void {
    const { width, height } = this.cameras.main;
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const radius = Phaser.Math.Between(3, 8);
      const alpha = Phaser.Math.FloatBetween(0.2, 0.6);
      const orb = this.add.circle(x, y, radius, 0x00d4ff, alpha);
      this.tweens.add({
        targets: orb,
        y: y - Phaser.Math.Between(30, 80),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 5000),
        ease: 'Sine.easeIn',
        delay: Phaser.Math.Between(0, 3000),
        repeat: -1,
        repeatDelay: Phaser.Math.Between(500, 2000),
        onRepeat: () => {
          orb.setPosition(
            Phaser.Math.Between(0, width),
            Phaser.Math.Between(height * 0.6, height)
          );
          orb.setAlpha(Phaser.Math.FloatBetween(0.2, 0.6));
        }
      });
    }
  }

  private startGame(): void {
    onPlatform((p) => p.gameplayStart());
    this.scene.start('GameScene');
  }
}
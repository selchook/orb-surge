import Phaser from 'phaser';
import { onPlatform } from '../ayvago/platform';

interface Particle {
  circle: Phaser.GameObjects.Arc;
  vx: number;
  vy: number;
  collected: boolean;
}

interface Hazard {
  circle: Phaser.GameObjects.Arc;
  vx: number;
  vy: number;
}

export class GameScene extends Phaser.Scene {
  private playerOrb!: Phaser.GameObjects.Arc;
  private orbRadius = 20;
  private magneticField = 150;
  private particles: Particle[] = [];
  private hazards: Hazard[] = [];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private sizeText!: Phaser.GameObjects.Text;
  private isGameOver = false;
  private invincible = false;
  private particleTimer = 0;
  private hazardTimer = 0;
  private readonly PARTICLE_INTERVAL = 1500;
  private readonly HAZARD_INTERVAL = 4000;
  private readonly MAX_PARTICLES = 18;
  private readonly MAX_HAZARDS = 6;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    this.orbRadius = 20;
    this.magneticField = 150;
    this.score = 0;
    this.isGameOver = false;
    this.invincible = false;
    this.particles = [];
    this.hazards = [];
    this.particleTimer = 0;
    this.hazardTimer = 0;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x080818);
    this.drawGrid(width, height);

    // Player orb
    this.playerOrb = this.add.circle(width / 2, height / 2, this.orbRadius, 0x00d4ff);
    this.tweens.add({
      targets: this.playerOrb,
      alpha: { from: 0.75, to: 1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // HUD
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#00d4ff',
    }).setDepth(10);

    this.sizeText = this.add.text(width - 16, 16, 'Size: 20', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ff6b6b',
    }).setOrigin(1, 0).setDepth(10);

    this.add.text(width / 2, height - 20, 'Move mouse to guide your orb', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#444466',
    }).setOrigin(0.5).setDepth(10);

    // Spawn initial particles and one hazard
    for (let i = 0; i < 8; i++) this.spawnParticle();
    this.spawnHazard();

    // Orb follows pointer
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isGameOver) return;
      this.playerOrb.setPosition(
        Phaser.Math.Clamp(pointer.x, this.orbRadius, width - this.orbRadius),
        Phaser.Math.Clamp(pointer.y, this.orbRadius, height - this.orbRadius),
      );
    });

    // R to restart after game over
    this.input.keyboard!.on('keydown-R', () => {
      if (this.isGameOver) this.scene.start('GameScene');
    });
  }

  private drawGrid(width: number, height: number): void {
    const g = this.add.graphics();
    g.lineStyle(1, 0x1a2a4a, 0.25);
    for (let x = 0; x <= width; x += 50) g.lineBetween(x, 0, x, height);
    for (let y = 0; y <= height; y += 50) g.lineBetween(0, y, width, y);
  }

  private spawnParticle(): void {
    const { width, height } = this.cameras.main;
    let x: number, y: number;
    let attempts = 0;
    do {
      x = Phaser.Math.Between(20, width - 20);
      y = Phaser.Math.Between(20, height - 20);
      attempts++;
    } while (
      Phaser.Math.Distance.Between(x, y, this.playerOrb.x, this.playerOrb.y) < 120 &&
      attempts < 20
    );

    const colors = [0x00ff88, 0xffdd00, 0xff88ff, 0x88ffff, 0xffaa44];
    const color = Phaser.Utils.Array.GetRandom(colors) as number;
    const circle = this.add.circle(x, y, 5, color);

    this.tweens.add({
      targets: circle,
      scale: { from: 0.8, to: 1.4 },
      duration: Phaser.Math.Between(700, 1300),
      yoyo: true,
      repeat: -1,
    });

    this.particles.push({
      circle,
      vx: Phaser.Math.FloatBetween(-25, 25),
      vy: Phaser.Math.FloatBetween(-25, 25),
      collected: false,
    });
  }

  private spawnHazard(): void {
    const { width, height } = this.cameras.main;
    const edge = Phaser.Math.Between(0, 3);
    let x: number, y: number;
    switch (edge) {
      case 0: x = 0;     y = Phaser.Math.Between(0, height); break;
      case 1: x = width; y = Phaser.Math.Between(0, height); break;
      case 2: x = Phaser.Math.Between(0, width); y = 0;      break;
      default: x = Phaser.Math.Between(0, width); y = height; break;
    }

    const circle = this.add.circle(x, y, 14, 0xff2244);
    this.tweens.add({
      targets: circle,
      scale: { from: 0.85, to: 1.2 },
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    const targetX = width / 2 + Phaser.Math.Between(-150, 150);
    const targetY = height / 2 + Phaser.Math.Between(-100, 100);
    const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
    const speed = Phaser.Math.Between(60, 110);

    this.hazards.push({
      circle,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    });
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) return;

    const dt = delta / 1000;
    const { width, height } = this.cameras.main;

    // Spawn timers
    this.particleTimer += delta;
    this.hazardTimer += delta;

    if (
      this.particleTimer >= this.PARTICLE_INTERVAL &&
      this.particles.length < this.MAX_PARTICLES
    ) {
      this.spawnParticle();
      this.particleTimer = 0;
    }
    if (
      this.hazardTimer >= this.HAZARD_INTERVAL &&
      this.hazards.length < this.MAX_HAZARDS
    ) {
      this.spawnHazard();
      this.hazardTimer = 0;
    }

    // Update particles
    for (const p of this.particles) {
      if (p.collected) continue;

      const dx = this.playerOrb.x - p.circle.x;
      const dy = this.playerOrb.y - p.circle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.magneticField && dist > 0) {
        const force = (1 - dist / this.magneticField) * 320;
        p.vx += (dx / dist) * force * dt;
        p.vy += (dy / dist) * force * dt;
      }

      p.vx *= 0.97;
      p.vy *= 0.97;
      p.circle.x += p.vx * dt;
      p.circle.y += p.vy * dt;

      if (p.circle.x < 5 || p.circle.x > width - 5) { p.vx *= -1; p.circle.x = Phaser.Math.Clamp(p.circle.x, 5, width - 5); }
      if (p.circle.y < 5 || p.circle.y > height - 5) { p.vy *= -1; p.circle.y = Phaser.Math.Clamp(p.circle.y, 5, height - 5); }

      if (dist < this.orbRadius + 5) {
        p.collected = true;
        p.circle.destroy();
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        this.orbRadius = Math.min(this.orbRadius + 0.8, 50);
        this.magneticField = 150 + (this.orbRadius - 20) * 3;
        this.playerOrb.setRadius(this.orbRadius);
        this.sizeText.setText(`Size: ${Math.round(this.orbRadius)}`);
      }
    }
    this.particles = this.particles.filter(p => !p.collected);

    // Update hazards
    for (const h of this.hazards) {
      h.circle.x += h.vx * dt;
      h.circle.y += h.vy * dt;

      if (h.circle.x < 14 || h.circle.x > width - 14) {
        h.vx *= -1;
        h.circle.x = Phaser.Math.Clamp(h.circle.x, 14, width - 14);
      }
      if (h.circle.y < 14 || h.circle.y > height - 14) {
        h.vy *= -1;
        h.circle.y = Phaser.Math.Clamp(h.circle.y, 14, height - 14);
      }

      if (this.invincible) continue;

      const dist = Phaser.Math.Distance.Between(
        h.circle.x, h.circle.y,
        this.playerOrb.x, this.playerOrb.y,
      );

      if (dist < this.orbRadius + 14) {
        this.orbRadius -= 5;
        this.sizeText.setText(`Size: ${Math.round(this.orbRadius)}`);
        this.cameras.main.shake(200, 0.012);
        this.invincible = true;
        this.playerOrb.setFillStyle(0xff4444);
        this.time.delayedCall(500, () => {
          this.invincible = false;
          if (!this.isGameOver) this.playerOrb.setFillStyle(0x00d4ff);
        });

        // Bounce hazard away from player
        const angle = Phaser.Math.Angle.Between(
          this.playerOrb.x, this.playerOrb.y,
          h.circle.x, h.circle.y,
        );
        h.vx = Math.cos(angle) * 160;
        h.vy = Math.sin(angle) * 160;

        if (this.orbRadius < 5) {
          this.triggerGameOver();
          return;
        }

        this.playerOrb.setRadius(this.orbRadius);
        this.magneticField = Math.max(80, 150 + (this.orbRadius - 20) * 3);
      }
    }
  }

  private triggerGameOver(): void {
    this.isGameOver = true;
    const finalScore = this.score;
    onPlatform((p) => {
      p.gameplayStop();
      p.endGame({ score: finalScore, won: false });
    });

    const prev = parseInt(localStorage.getItem('orbSurgeHighScore') || '0');
    if (this.score > prev) {
      localStorage.setItem('orbSurgeHighScore', String(this.score));
      onPlatform((p) => p.celebrate());
    }

    this.time.delayedCall(300, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
}

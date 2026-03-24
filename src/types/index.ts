export interface GameConfig {
  width: number;
  height: number;
}

export interface OrbData {
  x: number;
  y: number;
  color: number;
  size: number;
  value: number;
}

export interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: number;
}

export interface PowerUpData {
  type: 'multiplier' | 'magnet' | 'slowtime' | 'shield';
  x: number;
  y: number;
  duration?: number;
}
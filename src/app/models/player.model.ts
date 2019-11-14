import { Sprite, Texture } from 'pixi.js';

import { CANVAS_SIZE, PHYSICS, SPRITE_URLS } from '../game-config.constants';

export class Player {
  private sprite: Sprite;
  private ySpeed: number;

  constructor() {
    this.sprite = Sprite.from(SPRITE_URLS.PLAYER.INITIAL);
    this.ySpeed = 0;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(250, CANVAS_SIZE.HEIGHT / 2);
    this.sprite.scale.set(5);
  }

  public getSprite(): Sprite {
    return this.sprite;
  }

  public killKiwi(): void {
    this.sprite.rotation = 180;
  }

  public calculateGravity(delta: number): void {
    this.ySpeed += PHYSICS.GRAVITY * delta;
    this.sprite.position.y += this.ySpeed;
  }

  public flap(): void {
    this.ySpeed = -PHYSICS.FLAP_POWER;
    this.changeAnimation(SPRITE_URLS.PLAYER.FLAPPING);
  }

  public changeAnimation(url: string): void {
    const texture = Texture.from(url);
    this.sprite.texture = texture;
  }
}

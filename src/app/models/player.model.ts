import { CANVAS_SIZE, PHYSICS, SPRITE_URLS } from '../game-config.constants';
import { Sprite, Texture } from 'pixi.js';

export class Player {
  private _sprite: Sprite;
  private ySpeed: number;

  constructor() {
    this._sprite = Sprite.from(SPRITE_URLS.PLAYER.INITIAL);
    this.ySpeed = 0;
    this._sprite.anchor.set(0.5);
    this._sprite.position.set(250, CANVAS_SIZE.HEIGHT / 2);
    this._sprite.scale.set(5);
  }

  public get sprite() {
    return this._sprite;
  }

  public get position() {
    return this._sprite.position;
  }

  public killKiwi(): void {
    this._sprite.rotation = 180;
  }

  public calculateGravity(delta: number): void {
    this.ySpeed += PHYSICS.GRAVITY * delta;
    this._sprite.position.y += this.ySpeed;
  }

  public flap(): void {
    this.ySpeed = -PHYSICS.FLAP_POWER;
    this.changeAnimation(SPRITE_URLS.PLAYER.FLAPPING);
  }

  public changeAnimation(url: string): void {
    const texture = Texture.from(url);
    this._sprite.texture = texture;
  }
}

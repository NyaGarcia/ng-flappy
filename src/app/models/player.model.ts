import * as PIXI from 'pixi.js';

import { CANVAS_SIZE, PHYSICS, SPRITE_URLS } from '../game_config.constants';

export class Player {
  private ySpeed: number;
  private sprite: any;

  constructor(public stage: PIXI.Container) {}

  public create(): void {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.PLAYER.INITIAL);
    this.ySpeed = 0;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(250, CANVAS_SIZE.HEIGHT / 2);
    this.sprite.scale.set(5);

    this.stage.addChild(this.sprite);
  }

  public getSprite(): PIXI.Sprite {
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
    const texture = PIXI.Texture.from(url);
    this.sprite.texture = texture;
  }
}

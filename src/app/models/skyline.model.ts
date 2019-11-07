import * as PIXI from 'pixi.js';

import { PHYSICS, SPRITE_URLS } from '../game_config.constants';

interface Position {
  x: number;
  y: number;
}

export class Skyline {
  private sprite: PIXI.Sprite;

  constructor(position: Position) {
    this.createGameObject(position);
  }

  public getSprite() {
    return this.sprite;
  }

  public updatePosition(delta: number) {
    this.sprite.position.x -= PHYSICS.SKYLINE_SPEED * delta;
  }

  private createGameObject({ x, y }: Position) {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.SKYLINE);
    this.sprite.anchor.set(0, 1);
    this.sprite.position.set(x, y);
    this.sprite.scale.set(5);

    this.sprite.type = 'skyline';
  }
}

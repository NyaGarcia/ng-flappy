import * as PIXI from 'pixi.js';

import {
  CANVAS_SIZE,
  PARAMS,
  PHYSICS,
  SPRITE_URLS
} from '../game_config.constants';

export class Pipe {
  public sprite: PIXI.Sprite;

  constructor(parent?: PIXI.Sprite) {
    this.createGameObject(parent);
  }

  public getSprite(): PIXI.Sprite {
    return this.sprite;
  }

  public updatePosition(delta: number): void {
    this.sprite.position.x -= PHYSICS.PIPE_SPEED * delta;
  }

  private createGameObject(parent?: PIXI.Sprite): void {
    this.sprite = PIXI.Sprite.from(SPRITE_URLS.PIPE);

    const anchor = {
      x: 0.5,
      y: 0.5
    };

    const pos = {
      x: CANVAS_SIZE.WIDTH + this.sprite.width,
      y: parent
        ? parent.position.y - PARAMS.VERTICAL_PIPES_SEPARATION
        : this.getRandomHeight()
    };

    const scale = {
      x: 7,
      y: parent ? -7 : 7
    };

    this.sprite.anchor.set(anchor.x, anchor.y);
    this.sprite.position.set(pos.x, pos.y);
    this.sprite.scale.set(scale.x, scale.y);

    this.sprite.type = 'pipe';
  }

  private getRandomHeight(): number {
    return Math.floor(Math.random() * 500) + 500;
  }
}

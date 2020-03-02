import { CANVAS_SIZE, PARAMS, PHYSICS, SPRITE_URLS } from '../game-config.constants';

import { Sprite } from 'pixi.js';

export class Pipe {
  private sprite: Sprite;

  constructor(parent?: Pipe) {
    this.sprite = Sprite.from(SPRITE_URLS.PIPE);

    const anchor = {
      x: 0.5,
      y: 0.5,
    };

    const pos = {
      x: CANVAS_SIZE.WIDTH + this.sprite.width,
      y: parent
        ? parent.getSprite().position.y - PARAMS.VERTICAL_PIPES_SEPARATION
        : this.getRandomHeight(),
    };

    const scale = {
      x: 7,
      y: parent ? -7 : 7,
    };

    this.sprite.anchor.set(anchor.x, anchor.y);
    this.sprite.position.set(pos.x, pos.y);
    this.sprite.scale.set(scale.x, scale.y);

    this.sprite.type = 'pipe';
  }

  public getSprite(): Sprite {
    return this.sprite;
  }

  public updatePosition(delta: number): void {
    this.sprite.position.x -= PHYSICS.PIPE_SPEED * delta;
  }

  private getRandomHeight(): number {
    return Math.floor(Math.random() * 500) + 500;
  }
}

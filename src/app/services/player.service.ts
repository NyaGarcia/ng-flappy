import { Container, Sprite } from 'pixi.js';
import { delay, filter, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { SPRITE_URLS } from '../game_config.constants';

@Injectable()
export class PlayerService {
  private player: Player;

  constructor(
    private stage: Container,
    private frameUpdate$: Observable<number>,
    private pressedKey$: Observable<KeyboardEvent>
  ) {
    this.subscribe();
  }

  public setPlayer(player: Player) {
    this.stage.addChild(player.getSprite());
    this.player = player;
  }

  public getSprite(): Sprite {
    return this.player.getSprite();
  }

  public killKiwi(): void {
    this.player.killKiwi();
  }

  private subscribe() {
    this.frameUpdate$.subscribe(delta => {
      this.player.calculateGravity(delta);
    });

    this.pressedKey$
      .pipe(
        filter(({ keyCode }) => keyCode === 32 || keyCode === 38),
        tap(() => this.player.flap()),
        delay(150),
        tap(() => this.player.changeAnimation(SPRITE_URLS.PLAYER.INITIAL))
      )
      .subscribe();
  }
}

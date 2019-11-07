import { Container, Sprite } from 'pixi.js';
import { delay, filter, tap, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { SPRITE_URLS } from '../game_config.constants';
import { GameService } from './game.service';

@Injectable()
export class PlayerService {
  private player: Player;
  private stage: Container;

  constructor(private gameService: GameService) {}

  public init() {
    this.player.create();
    this.stage.addChild(this.player.getSprite());
    this.subscribe();
  }

  configure(stage: Container) {
    this.stage = stage;
    this.player = new Player(stage);
  }

  public getSprite(): Sprite {
    return this.player.getSprite();
  }

  public killKiwi(): void {
    this.player.killKiwi();
  }

  private subscribe() {
    this.gameService.getFrameUpdate().subscribe(delta => this.player.calculateGravity(delta));

    this.gameService.pressedKey$
      .pipe(
        filter(({ keyCode }) => keyCode === 32 || keyCode === 38),
        tap(() => this.player.flap()),
        delay(150),
        tap(() => this.player.changeAnimation(SPRITE_URLS.PLAYER.INITIAL)),
        takeUntil(this.gameService.destroy$),
      )
      .subscribe();
  }
}

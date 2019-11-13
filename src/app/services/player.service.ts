import { Container, Sprite } from 'pixi.js';
import { delay, tap } from 'rxjs/operators';

import { GameService } from './game.service';
import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { SPRITE_URLS } from '../game_config.constants';

@Injectable()
export class PlayerService {
  private player: Player;
  private stage: Container;

  constructor(private gameService: GameService) {}

  public init() {
    this.player.createGameObject();
    this.stage.addChild(this.player.getSprite());
    this.subscribe();
  }

  configure(stage: Container) {
    this.stage = stage;
    this.player = new Player();
  }

  public getSprite(): Sprite {
    return this.player.getSprite();
  }

  public killKiwi(): void {
    this.player.killKiwi();
  }

  private subscribe() {
    this.gameService.getFrameUpdate().subscribe(delta => this.player.calculateGravity(delta));

    this.gameService.flap$
      .pipe(
        tap(() => this.player.flap()),
        delay(150),
        tap(() => this.player.changeAnimation(SPRITE_URLS.PLAYER.INITIAL)),
      )
      .subscribe();
  }
}

import { Container } from 'pixi.js';
import { GameService } from './game.service';
import { Injectable } from '@angular/core';
import { Pipe } from '../models/pipe.model';

@Injectable()
export class PipeService {
  constructor(private gameService: GameService) {}

  public addPipe(stage: Container, pipe: Pipe): void {
    stage.addChild(pipe.getSprite());
    this.subscribe(pipe);
  }

  public deleteOldPipes(stage: Container): void {
    stage.children
      .filter(Boolean)
      .filter(({ type }) => type === 'pipe')
      .filter(({ position }) => position.x < 0)
      .forEach(pipe => stage.removeChild(pipe));
  }

  private subscribe(pipe: Pipe): void {
    this.gameService.getFrameUpdate().subscribe(delta => pipe.updatePosition(delta));
  }
}

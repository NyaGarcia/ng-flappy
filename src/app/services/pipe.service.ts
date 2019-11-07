import { Container } from 'pixi.js';
import { Injectable } from '@angular/core';
import { Pipe } from '../models/pipe.model';
import { GameService } from './game.service';

@Injectable()
export class PipeService {
  private stage: Container;

  constructor(private gameSevice: GameService) {}

  public setContainer(stage: Container) {
    this.stage = stage;
  }

  public addPipe(pipe: Pipe): void {
    this.stage.addChild(pipe.getSprite());
    this.subscribe(pipe);
  }

  public deleteOldPipes(): void {
    this.stage.children
      .filter(Boolean)
      .filter(({ type }) => type === 'pipe')
      .filter(({ position }) => position.x < 0)
      .forEach(pipe => this.stage.removeChild(pipe));
  }

  private subscribe(pipe: Pipe): void {
    this.gameSevice.getFrameUpdate().subscribe(delta => pipe.updatePosition(delta));
  }
}

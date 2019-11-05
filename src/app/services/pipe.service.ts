import { Container } from 'pixi.js';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pipe } from '../models/pipe.model';

@Injectable()
export class PipeService {
  constructor(
    private frameUpdate$: Observable<number>,
    private stage: Container
  ) {}

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
    this.frameUpdate$.subscribe(delta => pipe.updatePosition(delta));
  }
}

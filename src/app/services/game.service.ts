import { Subject, fromEvent, interval, timer } from 'rxjs';
import { bufferTime, filter, share, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { PHYSICS } from '../game_config.constants';

@Injectable()
export class GameService {
  pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');

  frameUpdate$ = new Subject<number>();
  backgroundUpdate$ = interval(1000);

  start$ = new Subject<void>();

  private destroy$ = new Subject<void>();

  easterEgg$ = this.pressedKey$.pipe(
    bufferTime(1000),
    filter(({ length }) => length > 6),
    takeUntil(this.destroy$),
  );

  flap$ = this.pressedKey$.pipe(
    filter(({ keyCode }) => keyCode === 32 || keyCode === 38),
    takeUntil(this.destroy$),
  );

  private pipeGeneration$ = timer(
    PHYSICS.PIPE_GENERATION_FIRST_WAIT,
    PHYSICS.PIPE_GENERATION_INTERVAL,
  ).pipe(share());

  startGame() {
    this.start$.next();
  }

  resetGame() {
    this.destroy$.next();
  }

  getFrameUpdate() {
    return this.frameUpdate$.pipe(takeUntil(this.destroy$));
  }

  whenCreateObstacles() {
    return this.pipeGeneration$.pipe(takeUntil(this.destroy$));
  }
}

import { Subject, fromEvent, interval, timer } from 'rxjs';
import { bufferTime, filter, scan, share, switchMap, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { PHYSICS } from '../game-config.constants';

@Injectable()
export class GameService {
  private stopGame$ = new Subject<void>();
  private pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(share());

  onFrameUpdate$ = new Subject<number>().pipe(takeUntil(this.stopGame$)) as Subject<number>;

  onStart$ = new Subject<void>();

  score$ = this.onStart$.pipe(
    switchMap(() => this.createObstacle$.pipe(scan(score => score + 1, 0))),
  );

  easterEgg$ = this.pressedKey$.pipe(
    bufferTime(1000),
    filter(({ length }) => length > 6),
    takeUntil(this.stopGame$),
  );

  onFlap$ = this.pressedKey$.pipe(
    filter(({ keyCode }) => keyCode === 32 || keyCode === 38),
    takeUntil(this.stopGame$),
  );

  createObstacle$ = timer(
    PHYSICS.PIPE_GENERATION_FIRST_WAIT,
    PHYSICS.PIPE_GENERATION_INTERVAL,
  ).pipe(share(), takeUntil(this.stopGame$));

  skylineUpdate$ = interval(1000).pipe(takeUntil(this.stopGame$));

  startGame() {
    this.onStart$.next();
  }

  stopGame() {
    this.stopGame$.next();
  }
}

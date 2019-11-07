import { Injectable } from '@angular/core';
import { Observable, fromEvent, interval, BehaviorSubject, Subject, timer, merge } from 'rxjs';
import { filter, switchAll, takeUntil, share } from 'rxjs/operators';
import { PHYSICS } from '../game_config.constants';

@Injectable()
export class GameService {
  pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');
  frameUpdate$ = new BehaviorSubject<Observable<number>>(null);
  backgroundUpdate$ = interval(1000);

  start$ = new Subject<void>();

  destroy$ = new Subject<void>();

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

  setFrameUpdate(frameUpdate$: Observable<number>) {
    this.frameUpdate$.next(frameUpdate$);
  }

  getFrameUpdate() {
    return this.frameUpdate$.pipe(
      filter(frameUpdate$ => !!frameUpdate$),
      switchAll(),
      takeUntil(this.destroy$),
    );
  }

  whenCreateObstacles() {
    return this.pipeGeneration$.pipe(takeUntil(this.destroy$));
  }
}

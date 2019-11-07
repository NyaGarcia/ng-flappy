import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { scan, switchMap } from 'rxjs/operators';

@Component({
  selector: 'kb-score',
  template: `
    <span class="is-size-2" style="font-family: Roboto">
      {{ score$ | async }}
    </span>
  `,
})
export class ScoreComponent {
  score$ = this.gameService.start$.pipe(
    switchMap(() => this.gameService.whenCreateObstacles().pipe(scan(score => score + 1, 0))),
  );

  constructor(private gameService: GameService) {}
}

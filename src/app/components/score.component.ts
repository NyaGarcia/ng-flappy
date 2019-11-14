import { Component } from '@angular/core';

import { GameService } from '../services/game.service';

@Component({
  selector: 'kb-score',
  template: `
    <span class="is-size-2" style="font-family: Roboto">
      {{ score$ | async }}
    </span>
  `,
})
export class ScoreComponent {
  score$ = this.gameService.score$;

  constructor(private gameService: GameService) {}
}

import { Component } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'kb-score',
  styleUrls: ['./score.component.css'],
  template: `
    <div class="score-container">
      <span class="is-size-2 pixelfont score">
        {{ score$ | async }}
      </span>
    </div>
  `,
})
export class ScoreComponent {
  score$ = this.gameService.score$;

  constructor(private gameService: GameService) {}
}

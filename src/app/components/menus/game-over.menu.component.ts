import { Component } from '@angular/core';

import { MenuComponent } from './menu.component';

@Component({
  template: `
    <h1 mat-dialog-title>Game over</h1>
    <div mat-dialog-content>
      <p>Press any key to restart the game</p>
    </div>
  `,
})
export class GameOverMenuComponent extends MenuComponent {}

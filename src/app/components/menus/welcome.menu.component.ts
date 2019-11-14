import { Component } from '@angular/core';

import { MenuComponent } from './menu.component';

@Component({
  template: `
    <h1 mat-dialog-title>Kiwi Bird</h1>
    <div mat-dialog-content>
      <p>Press any key to start the game</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button color="primary" cdkFocusInitial (click)="onPressAnyKey()">
        Start game!
      </button>
    </div>
  `,
})
export class WelcomeMenuComponent extends MenuComponent {}

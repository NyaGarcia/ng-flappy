import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { WelcomeMenuComponent } from '../components/menus/welcome.menu.component';
import { GameOverMenuComponent } from '../components/menus/game-over.menu.component';

@Injectable()
export class MenusService {
  constructor(private dialog: MatDialog) {}

  welcome() {
    return this.dialog
      .open(WelcomeMenuComponent, {
        disableClose: true,
      })
      .afterClosed();
  }

  gameOver() {
    return this.dialog
      .open(GameOverMenuComponent, {
        disableClose: true,
      })
      .afterClosed();
  }
}

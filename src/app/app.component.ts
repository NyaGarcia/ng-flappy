import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { MenuDialogComponent } from './components/menu.component';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(public dialog: MatDialog, public gameService: GameService) {
    this.dialog
      .open(MenuDialogComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe(() => this.gameService.startGame());
  }
}

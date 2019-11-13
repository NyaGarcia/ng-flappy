import { Component, HostListener } from '@angular/core';

import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'kb-menu',
  template: `
    <h1 mat-dialog-title>Game over</h1>
    <div mat-dialog-content>
      <p>Press any key to restart the game</p>
    </div>
  `,
})
export class MenuDialogComponent {
  constructor(public dialogRef: MatDialogRef<MenuDialogComponent>) {}

  @HostListener('document:keydown')
  startGame() {
    this.dialogRef.close();
  }
}

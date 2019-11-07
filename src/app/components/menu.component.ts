import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'kb-menu',
  template: `
    <h1 mat-dialog-title>Kiwi Bird</h1>
    <div mat-dialog-content>
      <p>Press any key to start the game</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button color="primary" cdkFocusInitial (click)="startGame()">
        Start game!
      </button>
    </div>
  `,
})
export class MenuDialogComponent {
  started = false;

  constructor(public dialogRef: MatDialogRef<MenuDialogComponent>) {}

  @HostListener('document:keydown')
  startGame() {
    if (!this.started) {
      this.started = true;

      return;
    }

    this.dialogRef.close();
  }
}

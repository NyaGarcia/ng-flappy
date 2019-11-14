import { HostListener, Injectable } from '@angular/core';

import { MatDialogRef } from '@angular/material';

@Injectable()
export class MenuComponent {
  constructor(public dialogRef: MatDialogRef<MenuComponent>) {}

  @HostListener('document:keydown')
  onPressAnyKey() {
    this.dialogRef.close();
  }
}

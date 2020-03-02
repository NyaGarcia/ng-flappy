import { Directive, HostListener, Injectable } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Directive()
//@Injectable()
export class MenuComponent {
  constructor(public dialogRef: MatDialogRef<MenuComponent>) {}

  @HostListener('document:keydown')
  onPressAnyKey() {
    this.dialogRef.close();
  }
}

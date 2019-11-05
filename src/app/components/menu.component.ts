import { Component } from '@angular/core';

@Component({
  selector: 'kb-menu',
  template: `
    <h1 mat-dialog-title>Hi</h1>
    <div mat-dialog-content>
      <p>What's your favorite animal?</p>
    </div>
    <!--<div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No Thanks</button>
      <button mat-button [mat-dialog-close]="data.animal" cdkFocusInitial>
        Ok
      </button>
    </div>-->
  `
})
export class MenuComponent {}

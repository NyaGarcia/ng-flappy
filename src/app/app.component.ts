import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MenuComponent } from './components/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public dialog: MatDialog) {
    const dialogRef = this.dialog.open(MenuComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

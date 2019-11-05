import { MatDialogModule } from '@angular/material';
import { MenuComponent } from './components/menu.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MenuComponent],
  imports: [MatDialogModule],
  entryComponents: [MenuComponent]
})
export class SharedMoule {}

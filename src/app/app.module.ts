import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './components/game.component';
import { GameService } from './services/game.service';
import { ScoreComponent } from './components/score.component';
import { EasterEggComponent } from './components/easter-egg.component';
import { GameOverMenuComponent } from './components/menus/game-over.menu.component';
import { WelcomeMenuComponent } from './components/menus/welcome.menu.component';
import { MenusService } from './services/menus.service';

const MATERIAL_MODULES = [
  MatDialogModule,
  MatButtonModule,
  MatGridListModule,
  MatToolbarModule,
  MatSnackBarModule,
];

const MENUS = [GameOverMenuComponent, WelcomeMenuComponent];

@NgModule({
  declarations: [AppComponent, GameComponent, ScoreComponent, EasterEggComponent, MENUS],
  entryComponents: [MENUS, EasterEggComponent],
  imports: [BrowserAnimationsModule, MATERIAL_MODULES],
  providers: [GameService, MenusService],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import {
  MatDialogModule,
  MatButtonModule,
  MatGridListModule,
  MatToolbarModule,
  MatSnackBarModule,
} from '@angular/material';

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

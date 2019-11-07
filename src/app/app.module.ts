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
import { NgModule } from '@angular/core';
import { PipeService } from './services/pipe.service';
import { PlayerService } from './services/player.service';
import { SkylineService } from './services/skyline.service';
import { GameService } from './services/game.service';
import { MenuDialogComponent } from './components/menu.component';
import { ScoreComponent } from './components/score.component';
import { EasterEggComponent } from './components/easter-egg.component';

const MATERIAL_MODULES = [
  MatDialogModule,
  MatButtonModule,
  MatGridListModule,
  MatToolbarModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MenuDialogComponent,
    ScoreComponent,
    EasterEggComponent,
  ],
  entryComponents: [MenuDialogComponent, EasterEggComponent],
  imports: [BrowserAnimationsModule, MATERIAL_MODULES],
  providers: [SkylineService, PipeService, PlayerService, GameService],
  bootstrap: [AppComponent],
})
export class AppModule {}

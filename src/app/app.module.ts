import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './components/game.component';
import { NgModule } from '@angular/core';
import { PipeService } from './services/pipe.service';
import { PlayerService } from './services/player.service';
import { SharedMoule } from './shared.module';
import { SkylineService } from './services/skyline.service';

@NgModule({
  declarations: [AppComponent, GameComponent],
  imports: [BrowserAnimationsModule, SharedMoule],
  providers: [SkylineService, PipeService, PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule {}

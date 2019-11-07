import * as PIXI from 'pixi.js';

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Application, SCALE_MODES, Sprite, settings } from 'pixi.js';
import { CANVAS_SIZE, SPRITE_URLS } from '../game_config.constants';
import { Observable, Subscriber } from 'rxjs';
import { bufferTime, filter, first, tap } from 'rxjs/operators';

import { Pipe } from '../models/pipe.model';
import { PipeService } from '../services/pipe.service';
import { PlayerService } from '../services/player.service';
import { Skyline } from '../models/skyline.model';
import { SkylineService } from '../services/skyline.service';
import { GameService } from '../services/game.service';
import { MatSnackBar } from '@angular/material';
import { EasterEggComponent } from './easter-egg.component';

@Component({
  selector: 'kb-game',
  template: `
    <div #game></div>
  `,
})
export class GameComponent implements AfterViewInit {
  private app: Application;
  private bump: any;

  @ViewChild('game', { static: true })
  gameContainer: ElementRef<HTMLDivElement>;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private skylineService: SkylineService,
    private pipeService: PipeService,
    private snackBar: MatSnackBar,
  ) {
    this.bump = new Bump(PIXI);

    this.gameService.start$.pipe(first()).subscribe(() => this.restart());
  }

  ngAfterViewInit(): void {
    this.startGame();
  }

  public startGame(): void {
    this.setupPixi();
    this.partialInit();
  }

  private setupPixi(): void {
    settings.SCALE_MODE = SCALE_MODES.NEAREST;

    this.app = new Application({
      width: CANVAS_SIZE.WIDTH,
      height: CANVAS_SIZE.HEIGHT,
      antialias: true,
      transparent: false,
      backgroundColor: 0x1099bb,
    });

    this.gameContainer.nativeElement.appendChild(this.app.view);

    this.app.stage.addChild(this.skylineService.skylines);
  }

  private restart() {
    this.destroy();

    this.skylineService.init();

    this.setupPixi();

    this.partialInit();
    this.addCollisions();
    this.playerService.init();
    this.gameService.startGame();
  }

  private partialInit(): void {
    this.setObservables();
    this.setBackground();
    this.setSkyline();
    this.setServices();
    this.setObstacles();
    this.app.stage.setChildIndex(this.skylineService.skylines, 1);
  }

  private setObservables(): void {
    const frameUpdate$ = new Observable((observer: Subscriber<number>) => {
      const listener = (delta: number) => observer.next(delta);

      this.app.ticker.add(listener);

      // NOTE: Teardown logic
      return () => {
        this.app.ticker.remove(listener);
      };
    });

    this.gameService.setFrameUpdate(frameUpdate$);

    // "Easter egg"
    this.gameService.pressedKey$
      .pipe(
        bufferTime(1000),
        filter(({ length }) => length > 6),
        tap(() => {
          this.snackBar.openFromComponent(EasterEggComponent, {
            duration: 1000,
            panelClass: ['white-snackbar'],
          });
        }),
      )
      .subscribe();
  }

  private addCollisions() {
    this.gameService.getFrameUpdate().subscribe(() => this.checkCollisions());
  }

  private setServices(): void {
    const { stage } = this.app;
    this.pipeService.setContainer(stage);
    this.playerService.configure(stage);
  }

  private setBackground(): void {
    const bg = Sprite.from(SPRITE_URLS.IMAGE_BACKGROUND);

    bg.anchor.set(0);
    bg.x = 0;
    bg.y = 0;

    this.app.stage.addChild(bg);
  }

  private setSkyline(): void {
    this.createInitialSkyline();
    this.gameService.backgroundUpdate$.subscribe(() => this.createSkyline());
  }

  private createInitialSkyline(): void {
    for (let i = 0; i < 3; i++) {
      this.createSkylinePiece(i * 500);
    }
  }

  private createSkyline(): void {
    const lastSkyline = this.skylineService.getLastSkylineObject();

    if (lastSkyline.position.x <= CANVAS_SIZE.WIDTH) {
      this.createSkylinePiece(lastSkyline.position.x + lastSkyline.width);
    }
  }

  private createSkylinePiece(positionX: number): void {
    const skyline = new Skyline({
      x: positionX,
      y: CANVAS_SIZE.HEIGHT,
    });

    this.skylineService.addSkyline(skyline);
  }

  private setObstacles(): void {
    this.gameService.whenCreateObstacles().subscribe(() => {
      this.createPipeSet();
      this.pipeService.deleteOldPipes();
    });
  }

  private createPipeSet(): void {
    const bottomPipe = new Pipe();
    this.pipeService.addPipe(bottomPipe);

    const topPipe = new Pipe(bottomPipe.getSprite());
    this.pipeService.addPipe(topPipe);
  }

  private checkCollisions(): void {
    const { children } = this.app.stage;

    if (
      children
        .filter(({ type }) => type === 'pipe')
        .some(pipe => this.bump.hit(this.playerService.getSprite(), pipe))
    ) {
      this.gameOver();
    }
  }

  private gameOver(): void {
    this.playerService.killKiwi();
    this.gameService.resetGame();

    this.showGameoverInfo();

    this.gameService.pressedKey$.pipe(first()).subscribe(() => this.restart());
  }

  private showGameoverInfo(): void {
    const gameOverSprite = Sprite.from(SPRITE_URLS.GAME_OVER_TEXT);

    gameOverSprite.anchor.set(0.5);
    gameOverSprite.position.set(CANVAS_SIZE.WIDTH / 2, CANVAS_SIZE.HEIGHT / 3);
    gameOverSprite.scale.set(10);

    this.app.stage.addChild(gameOverSprite);
  }

  private destroy(): void {
    this.gameService.resetGame();

    // NOTE: Destroy all
    this.app.destroy(true, {
      texture: true,
      children: true,
      baseTexture: true,
    });
  }
}

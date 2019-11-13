import * as PIXI from 'pixi.js';

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Application, Container, DisplayObject, SCALE_MODES, Sprite, settings } from 'pixi.js';
import { CANVAS_SIZE, SPRITE_URLS } from '../game_config.constants';
import { delay, first, tap } from 'rxjs/operators';

import { EasterEggComponent } from './easter-egg.component';
import { GameService } from '../services/game.service';
import { MatSnackBar } from '@angular/material';
import { Pipe } from '../models/pipe.model';
import { Player } from '../models/player.model';
import { Skyline } from '../models/skyline.model';

@Component({
  selector: 'kb-game',
  template: `
    <div #game></div>
  `,
})
export class GameComponent implements AfterViewInit {
  private app: Application;
  private skylineContainer: Container;
  private bump: any;
  private player: Player;

  @ViewChild('game', { static: true })
  gameContainer: ElementRef<HTMLDivElement>;

  constructor(private gameService: GameService, private snackBar: MatSnackBar) {
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

    this.skylineContainer = new Container();
    this.app.stage.addChild(this.skylineContainer);
  }

  private restart() {
    this.destroy();
    this.setupPixi();

    this.partialInit();
    this.addCollisions();

    this.setPlayer();
    this.gameService.startGame();
  }

  private setPlayer() {
    this.player = new Player();
    this.app.stage.addChild(this.player.getSprite());
    this.gameService.getFrameUpdate().subscribe(delta => this.player.calculateGravity(delta));

    this.gameService.flap$
      .pipe(
        tap(() => this.player.flap()),
        delay(150),
        tap(() => this.player.changeAnimation(SPRITE_URLS.PLAYER.INITIAL)),
      )
      .subscribe();
  }

  private partialInit(): void {
    this.setObservables();
    this.setBackground();
    this.setSkyline();
    this.setObstacles();
    this.app.stage.setChildIndex(this.skylineContainer, 1);
  }

  private setObservables(): void {
    this.app.ticker.add((delta: number) => this.gameService.frameUpdate$.next(delta));

    // "Easter egg"
    this.gameService.easterEgg$
      .pipe(
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

  private setBackground(): void {
    const bg = Sprite.from(SPRITE_URLS.IMAGE_BACKGROUND);

    bg.anchor.set(0);
    bg.x = 0;
    bg.y = 0;

    this.app.stage.addChild(bg);
  }

  private setSkyline(): void {
    for (let i = 0; i < 3; i++) {
      this.createSkylinePiece(i * 500);
    }

    this.gameService.backgroundUpdate$.subscribe(() => this.createSkyline());
  }

  private createSkyline(): void {
    //const lastSkyline = this.skylineService.getLastSkylineObject();
    const lastSkyline = this.getLastSkyline();

    if (lastSkyline.position.x <= CANVAS_SIZE.WIDTH) {
      this.createSkylinePiece(lastSkyline.position.x + lastSkyline.width);
    }
  }

  private getLastSkyline(): DisplayObject {
    const { children } = this.skylineContainer;
    return children[children.length - 1];
  }

  private createSkylinePiece(positionX: number): void {
    const skyline = new Skyline({
      x: positionX,
      y: CANVAS_SIZE.HEIGHT,
    });

    //this.skylineService.addSkyline(skyline);
    this.skylineContainer.addChild(skyline.getSprite());
  }

  private setObstacles(): void {
    this.gameService.whenCreateObstacles().subscribe(() => {
      this.createPipeSet();
      this.deleteOldPipes();
    });
  }

  private createPipeSet(): void {
    const bottomPipe = new Pipe();
    this.gameService.getFrameUpdate().subscribe(delta => bottomPipe.updatePosition(delta));
    this.app.stage.addChild(bottomPipe.getSprite());

    const topPipe = new Pipe(bottomPipe.getSprite());
    this.gameService.getFrameUpdate().subscribe(delta => topPipe.updatePosition(delta));
    this.app.stage.addChild(topPipe.getSprite());
  }

  private deleteOldPipes(): void {
    this.app.stage.children
      .filter(Boolean)
      .filter(({ type }) => type === 'pipe')
      .filter(({ position }) => position.x < 0)
      .forEach(pipe => this.app.stage.removeChild(pipe));
  }

  private checkCollisions(): void {
    const { children } = this.app.stage;

    if (
      children
        .filter(({ type }) => type === 'pipe')
        .some(pipe => this.bump.hit(this.player.getSprite(), pipe))
    ) {
      this.gameOver();
    }
  }

  private gameOver(): void {
    this.player.killKiwi();
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

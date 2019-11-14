import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import * as PIXI from 'pixi.js';
import { delay, first, tap } from 'rxjs/operators';

import { CANVAS_SIZE, SPRITE_URLS } from '../game-config.constants';
import { EasterEggComponent } from './easter-egg.component';
import { GameService } from '../services/game.service';
import { Pipe } from '../models/pipe.model';
import { Player } from '../models/player.model';
import { Skyline } from '../models/skyline.model';
import { MenusService } from '../services/menus.service';

@Component({
  selector: 'kb-game',
  template: `
    <div #game style="border-radius: 10px;"></div>
  `,
})
export class GameComponent implements OnInit {
  private app: PIXI.Application;
  private skylineContainer: PIXI.Container;

  private bump: any;

  private player: Player;

  @ViewChild('game', { static: true })
  gameContainer: ElementRef<HTMLDivElement>;

  constructor(
    private menus: MenusService,
    private gameService: GameService,
    private snackBar: MatSnackBar,
  ) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.bump = new Bump(PIXI);

    this.gameService.onStart$.pipe(first()).subscribe(() => {
      this.gameService.stopGame();
      this.restart();
    });

    this.menus.welcome().subscribe(() => this.gameService.startGame());
  }

  ngOnInit(): void {
    this.setupPixi();
    this.prepareGameWithBackgroundAndObstacles();
  }

  private setupPixi(): void {
    this.app = new PIXI.Application({
      width: CANVAS_SIZE.WIDTH,
      height: CANVAS_SIZE.HEIGHT,
      antialias: true,
      transparent: false,
      backgroundColor: 0x1099bb,
    });

    this.gameContainer.nativeElement.appendChild(this.app.view);

    this.skylineContainer = new PIXI.Container();
    this.app.stage.addChild(this.skylineContainer);

    this.app.ticker.add((delta: number) => this.gameService.onFrameUpdate$.next(delta));
  }

  private prepareGameWithBackgroundAndObstacles(): void {
    this.setBackground();
    this.setSkyline();
    this.setObstacles();
  }

  private restart(): void {
    this.destroy();

    this.setupPixi();

    this.prepareGameWithBackgroundAndObstacles();
    this.addCapabilitiesToPlayGame();

    this.setEasterEgg();

    this.gameService.startGame();
  }

  private addCapabilitiesToPlayGame(): void {
    this.createPlayer();
    this.addCollisions();
  }

  private setObstacles(): void {
    this.gameService.whenToCreateObstacles$.subscribe(() => {
      this.createPipeSet();
      this.deleteOldPipes();
    });
  }

  private createPlayer(): void {
    this.player = new Player();
    this.app.stage.addChild(this.player.getSprite());
    this.gameService.onFrameUpdate$.subscribe(delta => this.player.calculateGravity(delta));

    this.gameService.onFlap$
      .pipe(
        tap(() => this.player.flap()),
        delay(150),
        tap(() => this.player.changeAnimation(SPRITE_URLS.PLAYER.INITIAL)),
      )
      .subscribe();
  }

  private addCollisions(): void {
    this.gameService.onFrameUpdate$.subscribe(() => this.checkCollisions());
  }

  private setBackground(): void {
    const bg = PIXI.Sprite.from(SPRITE_URLS.IMAGE_BACKGROUND);

    bg.anchor.set(0);
    bg.x = 0;
    bg.y = 0;

    this.app.stage.addChild(bg);
  }

  private setEasterEgg(): void {
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

  private setSkyline(): void {
    for (let i = 0; i < 3; i++) {
      this.createSkylinePiece(i * 500);
    }

    this.app.stage.setChildIndex(this.skylineContainer, 1);

    this.gameService.whenToCreateSkyline$.subscribe(() => this.createSkyline());
  }

  private createSkyline(): void {
    const lastSkyline = this.getLastSkyline();

    if (lastSkyline.position.x <= CANVAS_SIZE.WIDTH) {
      this.createSkylinePiece(lastSkyline.position.x + lastSkyline.width);
    }
  }

  private getLastSkyline(): PIXI.DisplayObject {
    const { children } = this.skylineContainer;

    return children[children.length - 1];
  }

  private createSkylinePiece(x: number): void {
    const skyline = new Skyline({
      x,
      y: CANVAS_SIZE.HEIGHT,
    });

    this.skylineContainer.addChild(skyline.getSprite());
    this.gameService.onFrameUpdate$.subscribe((delta) =>
      skyline.updatePosition(delta)
    );
  }

  private createPipeSet(): void {
    const bottomPipe = new Pipe();
    const topPipe = new Pipe(bottomPipe);

    for (const pipe of [bottomPipe, topPipe]) {
      this.app.stage.addChild(pipe.getSprite());
      this.gameService.onFrameUpdate$.subscribe(delta => pipe.updatePosition(delta));
    }
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

    this.gameService.stopGame();

    this.showGameoverInfo();
    this.menus.gameOver().subscribe(() => this.restart());
  }

  private showGameoverInfo(): void {
    const gameOverSprite = PIXI.Sprite.from(SPRITE_URLS.GAME_OVER_TEXT);

    gameOverSprite.anchor.set(0.5);
    gameOverSprite.position.set(CANVAS_SIZE.WIDTH / 2, CANVAS_SIZE.HEIGHT / 3);
    gameOverSprite.scale.set(10);

    this.app.stage.addChild(gameOverSprite);
  }

  private destroy() {
    this.app.destroy(true, {
      texture: true,
      children: true,
      baseTexture: true,
    });
  }
}

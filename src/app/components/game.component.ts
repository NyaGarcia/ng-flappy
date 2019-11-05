import * as PIXI from 'pixi.js';

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Application, Container, SCALE_MODES, Sprite, settings } from 'pixi.js';
import { CANVAS_SIZE, PHYSICS, SPRITE_URLS } from '../game_config.constants';
import {
  Observable,
  Subject,
  Subscriber,
  fromEvent,
  interval,
  timer
} from 'rxjs';
import { bufferTime, filter, first, takeUntil, tap } from 'rxjs/operators';

import { Pipe } from '../models/pipe.model';
import { PipeService } from '../services/pipe.service';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service';
import { Skyline } from '../models/skyline.model';
import { SkylineService } from '../services/skyline.service';

@Component({
  selector: 'kb-game',
  template: `
    <div #game></div>
  `
})
export class GameComponent implements AfterViewInit {
  private app: Application;
  private bump: any;
  private skylineContainer: Container;

  @ViewChild('game', { static: true })
  gameContainer: ElementRef<HTMLDivElement>;

  private pressedKey$: Observable<KeyboardEvent>;
  private frameUpdate$: Observable<number>;
  private backgroundUpdate$: Observable<number>;
  private destroy$ = new Subject<void>();

  private playerService: PlayerService;
  private skylineService: SkylineService;
  private pipeService: PipeService;

  constructor(/* private scoreService: ScoreService */) {
    this.bump = new Bump(PIXI);
  }

  ngAfterViewInit(): void {
    this.startGame();
  }

  public startGame(): void {
    this.setupPixi();
    this.init();
  }

  private setupPixi(): void {
    settings.SCALE_MODE = SCALE_MODES.NEAREST;

    this.app = new Application({
      width: CANVAS_SIZE.WIDTH,
      height: CANVAS_SIZE.HEIGHT,
      antialias: true,
      transparent: false,
      backgroundColor: 0x1099bb
    });

    this.gameContainer.nativeElement.appendChild(this.app.view);

    this.skylineContainer = new Container();
    this.app.stage.addChild(this.skylineContainer);
  }

  private init(): void {
    this.setObservables();
    this.setServices();
    this.setBackground();
    this.setSkyline();
    this.setPlayer();
    this.setObstacles();
    this.app.stage.setChildIndex(this.skylineContainer, 1);
  }

  private setObservables(): void {
    this.frameUpdate$ = new Observable((observer: Subscriber<number>) => {
      const listener = (delta: number) => observer.next(delta);

      this.app.ticker.add(listener);

      // NOTE: Teardown logic
      return () => {
        this.app.ticker.remove(listener);
      };
    }).pipe(takeUntil(this.destroy$));

    this.frameUpdate$.subscribe(() => this.checkCollisions());

    this.pressedKey$ = fromEvent<KeyboardEvent>(document, 'keydown');
    this.backgroundUpdate$ = interval(1000);

    // "Easter egg"
    this.pressedKey$
      .pipe(
        bufferTime(1000),
        filter(({ length }) => length > 6),
        tap(() => {
          //   this.gui.messages.innerHTML += 'WOW, SO MUCH POWER<br>';
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private setServices(): void {
    this.playerService = this.playerService = new PlayerService(
      this.app.stage,
      this.frameUpdate$,
      this.pressedKey$.pipe(takeUntil(this.destroy$))
    );
    this.skylineService = new SkylineService(
      this.frameUpdate$,
      this.skylineContainer
    );

    this.pipeService = new PipeService(this.frameUpdate$, this.app.stage);
  }

  private setBackground(): void {
    const bg = Sprite.from(SPRITE_URLS.IMAGE_BACKGROUND);

    bg.anchor.set(0);
    bg.x = 0;
    bg.y = 0;

    this.app.stage.addChild(bg);
  }

  private setPlayer(): void {
    this.playerService.setPlayer(this.createPlayer());
  }

  private createPlayer(): Player {
    return new Player(this.app.stage);
  }

  private setSkyline(): void {
    this.createInitialSkyline();
    this.backgroundUpdate$.subscribe(() => this.createSkyline());
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
      y: CANVAS_SIZE.HEIGHT
    });

    this.skylineService.addSkyline(skyline);
  }

  private setObstacles(): void {
    timer(PHYSICS.PIPE_GENERATION_FIRST_WAIT, PHYSICS.PIPE_GENERATION_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.createPipeSet();
        this.pipeService.deleteOldPipes();
        this.updateScore();
      });
  }

  private createPipeSet(): void {
    const bottomPipe = new Pipe(this.frameUpdate$);
    this.pipeService.addPipe(bottomPipe);

    const topPipe = new Pipe(this.frameUpdate$, bottomPipe.getSprite());
    this.pipeService.addPipe(topPipe);
  }

  private updateScore(): void {
    // this.scoreService.add();
    // this.gui.scoreboard.innerHTML = `${this.scoreService.score}`;
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

    this.unsubscribe();
    this.showGameoverInfo();

    this.pressedKey$.pipe(first()).subscribe(() => this.resetGame());
  }

  private showGameoverInfo(): void {
    const gameOverSprite = Sprite.from(SPRITE_URLS.GAME_OVER_TEXT);

    gameOverSprite.anchor.set(0.5);
    gameOverSprite.position.set(CANVAS_SIZE.WIDTH / 2, CANVAS_SIZE.HEIGHT / 3);
    gameOverSprite.scale.set(10);

    this.app.stage.addChild(gameOverSprite);
  }

  private unsubscribe(): void {
    this.destroy$.next();
  }

  private resetGame(): void {
    // this.scoreService.reset();

    // NOTE: Destroy all
    this.app.destroy(true, {
      texture: true,
      children: true,
      baseTexture: true
    });

    this.startGame();
  }
}

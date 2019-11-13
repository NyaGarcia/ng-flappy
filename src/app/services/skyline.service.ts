import { Container, DisplayObject } from 'pixi.js';

import { GameService } from './game.service';
import { Injectable } from '@angular/core';
import { Skyline } from '../models/skyline.model';

@Injectable()
export class SkylineService {
  skylines: Container;

  constructor(private gameService: GameService) {
    this.init();
  }

  init() {
    this.skylines = new Container();
  }

  public getLastSkylineObject(): DisplayObject {
    const { children } = this.skylines;
    return children[children.length - 1];
  }

  public addSkyline(skyline: Skyline): void {
    this.skylines.addChild(skyline.getSprite());
    this.subscribe(skyline);
  }

  public deleteSkyline(skyline: DisplayObject): void {
    this.skylines.removeChild(skyline);
  }

  private subscribe(skyline: Skyline): void {
    this.gameService.getFrameUpdate().subscribe(delta => skyline.updatePosition(delta));
  }
}

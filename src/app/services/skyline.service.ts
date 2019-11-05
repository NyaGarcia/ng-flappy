import { Container, DisplayObject } from 'pixi.js';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skyline } from '../models/skyline.model';

@Injectable()
export class SkylineService {
  constructor(
    private frameUpdate$: Observable<number>,
    private skylines: Container
  ) {}

  public getSkylines(): Container {
    return this.skylines;
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
    this.frameUpdate$.subscribe(delta => skyline.updatePosition(delta));
  }
}

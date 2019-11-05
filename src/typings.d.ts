declare namespace PIXI {
  interface CustomProperties {
    width: any;

    type: 'skyline' | 'pipe';
  }

  interface DisplayObject extends CustomProperties {}

  interface Sprite extends CustomProperties {}
}

declare var Bump: any;

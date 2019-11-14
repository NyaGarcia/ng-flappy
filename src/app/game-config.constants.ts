export const CANVAS_SIZE = {
  HEIGHT: 600,
  WIDTH: 1000,
} as const;

export const SPRITE_URLS = {
  PLAYER: {
    INITIAL: 'assets/sprites/player/sprite_0.png',
    FLAPPING: 'assets/sprites/player/sprite_1.png',
  },
  PIPE: 'assets/sprites/pipe.png',
  IMAGE_BACKGROUND: 'assets/backgrounds/background.jpg',
  SKYLINE: 'assets/backgrounds/skyline.png',
  GAME_OVER_TEXT: 'assets/sprites/game-over.png',
} as const;

export const PHYSICS = {
  PIPE_SPEED: 1.75,
  SKYLINE_SPEED: 0.5,
  PIPE_GENERATION_FIRST_WAIT: 1500,
  PIPE_GENERATION_INTERVAL: 2500,
  GRAVITY: 0.15,
  FLAP_POWER: 5,
} as const;

export const PARAMS = {
  VERTICAL_PIPES_SEPARATION: 1000,
} as const;

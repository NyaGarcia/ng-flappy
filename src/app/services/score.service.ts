export class ScoreService {
  public score = 0;

  constructor() {}

  public add(points = 1) {
    this.score += points;
  }

  public reset() {
    this.score = 0;
  }
}

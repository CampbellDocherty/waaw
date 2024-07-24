export class Vector {
  xVel: number;
  yVel: number;
  xPos: number;
  yPos: number;
  updateRate: number;

  constructor(xPos: number, yPos: number, xVel: number, yVel: number) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = xVel;
    this.yVel = yVel;
    this.updateRate = 1 / 60;
  }

  updateVelocity(newX: number, newY: number): void {
    this.xVel = newX * this.updateRate;
    this.yVel = newY * this.updateRate;
  }

  updatePosition(newX: number, newY: number): void {
    this.xPos = newX + this.xVel * 0.5;
    this.yPos = newY + this.yVel * 0.5;
  }

  get position() {
    return { x: this.xPos, y: this.yPos };
  }
}

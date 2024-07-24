export class Vector {
  xVel: number;
  yVel: number;
  xPos: number;
  yPos: number;

  constructor(xPos: number, yPos: number, xVel: number, yVel: number) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = xVel;
    this.yVel = yVel;
  }

  updateVelocity(newX: number, newY: number): void {
    this.xVel = newX;
    this.yVel = newY;
  }

  updatePosition(newX: number, newY: number): void {
    this.xPos = newX + this.xVel * 0.5;
    this.yPos = newY + this.yVel * 0.5;
    this.onUpdate();
  }

  private onUpdate(): void {
    if (this.xPos > window.innerWidth || this.xPos < 0) {
      this.xVel *= -1;
    }
    if (this.yPos > window.innerHeight || this.yPos < 0) {
      this.yVel *= -1;
    }
  }

  get position() {
    return { x: this.xPos, y: this.yPos };
  }
}

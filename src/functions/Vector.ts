import * as p from '@p5-wrapper/react';

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
  }

  get position() {
    return { x: this.xPos, y: this.yPos };
  }

  constrain(
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    p5: p.P5CanvasInstance
  ): void {
    this.xPos = p5.constrain(this.xPos, minX, maxX);
    this.yPos = p5.constrain(this.yPos, minY, maxY);
  }
}

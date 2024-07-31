import * as p from '@p5-wrapper/react';

export class Star {
  xVel: number;
  yVel: number;
  xPos: number;
  yPos: number;
  p5: p.P5CanvasInstance;
  closeRadius = 20;
  farRadius = 40;
  colour = 'white';

  constructor(xPos: number, yPos: number, xVel: number, yVel: number) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = xVel;
    this.yVel = yVel;
  }

  bindToP5Instance(p5: p.P5CanvasInstance): void {
    this.p5 = p5;
  }

  updateVelocity(newX: number, newY: number): void {
    this.xVel = newX;
    this.yVel = newY;
  }

  updatePosition(newX: number, newY: number): void {
    this.xPos = newX + this.xVel * 0.5;
    this.yPos = newY + this.yVel * 0.5;
    this.constrain(innerWidth, innerHeight, this.farRadius, this.p5);
  }

  updateColour(newColour: string): void {
    this.colour = newColour;
  }

  get position() {
    return { x: this.xPos, y: this.yPos };
  }

  constrain(
    containerWidth: number,
    containerHeight: number,
    shapeWidth: number,
    p5: p.P5CanvasInstance
  ): void {
    const minX = -containerWidth / 2 + shapeWidth;
    const maxX = containerWidth / 2 - shapeWidth;
    const minY = -containerHeight / 2 + shapeWidth;
    const maxY = containerHeight / 2 - shapeWidth;
    this.xPos = p5.constrain(this.xPos, minX, maxX);
    this.yPos = p5.constrain(this.yPos, minY, maxY);
  }

  draw = (
    p5: p.P5CanvasInstance
  ): {
    x: number;
    y: number;
  }[] => {
    p5.fill(this.colour);
    const x = this.xPos;
    const y = this.yPos;
    const radius1 = this.closeRadius;
    const radius2 = this.farRadius;
    const npoints = 5;
    const TWO_PI = 2 * Math.PI;
    const angle = TWO_PI / npoints;
    const halfAngle = angle / 2.0;

    const vertices = [];
    p5.beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + p5.cos(a) * radius2;
      let sy = y + p5.sin(a) * radius2;
      vertices.push({ x: sx, y: sy });
      p5.vertex(sx, sy);
      sx = x + p5.cos(a + halfAngle) * radius1;
      sy = y + p5.sin(a + halfAngle) * radius1;
      vertices.push({ x: sx, y: sy });
      p5.vertex(sx, sy);
    }
    p5.endShape(p5.CLOSE);
    return vertices;
  };
}

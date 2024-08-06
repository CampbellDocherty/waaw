import * as p from '@p5-wrapper/react';

export class PowerUp {
  color: string;
  xPosition: number;
  yPosition: number;
  p5: p.P5CanvasInstance;
  shouldDraw = false;
  hasBeenCollected = false;

  constructor(
    color: string,
    xPosition: number,
    yPosition: number,
    p5: p.P5CanvasInstance
  ) {
    this.color = color;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.p5 = p5;
  }

  setPositionWithinBounds = (
    left: number,
    right: number,
    top: number,
    bottom: number
  ) => {
    this.xPosition = this.p5.random(left, right);
    this.yPosition = this.p5.random(top, bottom);
  };

  checkIfColliding = (x: number, y: number): boolean => {
    if (!this.shouldDraw) {
      return false;
    }
    const { left, right, top, bottom } = this.boundingBox;
    return x > left && x < right && y > top && y < bottom;
  };

  remove(): void {
    this.hasBeenCollected = true;
    this.shouldDraw = false;
  }

  private get boundingBox() {
    const farLeftOfCircle = this.xPosition - 10;
    const farRightOfCircle = this.xPosition + 10;
    const topOfCircle = this.yPosition - 10;
    const bottomOfCircle = this.yPosition + 10;

    return {
      left: farLeftOfCircle,
      right: farRightOfCircle,
      top: topOfCircle,
      bottom: bottomOfCircle,
    };
  }
}

export class ColourPowerUp extends PowerUp {
  constructor(
    color: string,
    xPosition: number,
    yPosition: number,
    p5: p.P5CanvasInstance
  ) {
    super(color, xPosition, yPosition, p5);
  }

  draw(): void {
    if (!this.shouldDraw) {
      return;
    }
    this.p5.push();
    this.p5.fill(this.color);

    this.p5.circle(this.xPosition, this.yPosition, 20);
    this.p5.pop();
  }
}

export class SpeedPowerUp extends PowerUp {
  speed: number;

  constructor(
    color: string,
    speed: number,
    xPosition: number,
    yPosition: number,
    p5: p.P5CanvasInstance
  ) {
    super(color, xPosition, yPosition, p5);
    this.speed = speed;
  }

  draw(): void {
    if (!this.shouldDraw) {
      return;
    }
    this.p5.push();
    this.p5.fill(this.color);
    this.p5.textSize(18);
    this.p5.text(`x${this.speed * 2}`, this.xPosition, this.yPosition);
    this.p5.pop();
  }
}

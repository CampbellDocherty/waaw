import * as p from '@p5-wrapper/react';
import { getRandomNumber } from './getRandomNumber';

export class FallingRectangle {
  p5: p.P5CanvasInstance;
  width: number;
  height: number;
  colour: string;
  xPosition: number;
  yPosition: number;
  shouldDraw = false;

  constructor({
    p5,
    width,
    height,
    colour,
    yOffset,
  }: {
    p5: p.P5CanvasInstance;
    width: number;
    height: number;
    colour: string;
    innerHeight: number;
    yOffset: number;
  }) {
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.colour = colour;
    const initialXPosition = getRandomNumber(
      0 - innerWidth / 2,
      innerWidth / 2
    );
    this.xPosition = initialXPosition;
    this.yPosition = 0 - innerHeight / 2 - height / 2 - yOffset;
  }

  draw(): void {
    if (!this.shouldDraw) return;
    this.p5.push();
    this.p5.color(this.colour);
    this.p5.rectMode(this.p5.CENTER);
    this.p5.rect(this.xPosition, this.yPosition, this.width, this.height);
    this.yPosition = this.yPosition += 2;
    if (this.yPosition - this.height / 2 > innerHeight) {
      this.shouldDraw = false;
    }
    this.p5.pop();
  }

  checkIfColliding = (x: number, y: number): boolean => {
    if (!this.shouldDraw) {
      return false;
    }
    const { left, right, top, bottom } = this.boundingBox;
    return x > left && x < right && y > top && y < bottom;
  };

  private get boundingBox() {
    const left = this.xPosition - this.width / 2;
    const right = this.xPosition + this.width / 2;
    const top = this.yPosition - this.height / 2;
    const bottom = this.yPosition + this.height / 2;

    return {
      left,
      right,
      top,
      bottom,
    };
  }
}

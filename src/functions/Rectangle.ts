import p5Type from 'p5';
import { getRandomNumber } from './getRandomNumber';

export class FallingRectangle {
  p5: p5Type;
  width: number;
  height: number;
  colour: string;
  stroke: string | null;
  xPosition: number;
  yPosition: number;
  initialY: number;
  shouldDraw = false;
  shouldAnimate = true;
  instructions: string | null = null;

  constructor({
    p5,
    width,
    height,
    colour,
    yOffset,
    stroke = 'white',
    instructions = null,
  }: {
    p5: p5Type;
    width: number;
    height: number;
    colour: string;
    yOffset: number;
    stroke?: string | null;
    instructions?: string | null;
  }) {
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.stroke = stroke;
    this.xPosition = this.randomX;
    const y = -innerHeight / 2 - height / 2 - yOffset;
    this.yPosition = y;
    this.initialY = y;
    this.instructions = instructions;
  }

  draw(): void {
    if (!this.shouldDraw) return;
    this.p5.push();
    this.p5.fill(this.colour);
    if (this.stroke) this.p5.stroke(this.stroke);
    this.p5.rectMode(this.p5.CENTER);
    this.p5.rect(this.xPosition, this.yPosition, this.width, this.height);
    if (this.instructions) {
      this.p5.strokeWeight(2);
      this.p5.stroke('black');
      this.p5.fill('black');
      this.p5.textSize(16);
      this.p5.textAlign(this.p5.CENTER);
      this.p5.text(this.instructions, 0, this.yPosition + 8);
    }
    this.yPosition = this.shouldAnimate
      ? (this.yPosition += 2)
      : this.yPosition;
    if (this.yPosition - this.height / 2 > this.p5.height) {
      this.shouldDraw = false;
    }
    this.p5.pop();
  }

  reset() {
    this.shouldAnimate = false;
    this.shouldDraw = false;
    this.yPosition = this.initialY;
    this.xPosition = this.randomX;
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

  private get randomX() {
    return this.width === innerWidth
      ? 0
      : getRandomNumber(-innerWidth / 2, innerWidth / 2);
  }
}

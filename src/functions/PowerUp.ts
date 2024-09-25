import * as p from '@p5-wrapper/react';

export class PowerUp {
  color: string;
  xPosition: number;
  yPosition: number;
  p5: p.P5CanvasInstance;
  shouldDraw = false;
  hasBeenCollected = false;
  button: any;

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

  bindToButton = (button: any): void => {
    this.button = button;
  };

  setPositionWithinBounds = () => {
    const left = -innerWidth / 2 + 60;
    const right = innerWidth / 2 - 60;
    const top = -innerHeight / 2 + 60;
    const bottom = innerHeight / 2 - 60;
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
    if (this.button) this.button.addClass('show-button');
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

export class ImagePowerUp extends PowerUp {
  image: any;
  src: string;

  constructor(
    color: string,
    xPosition: number,
    yPosition: number,
    p5: p.P5CanvasInstance,
    src: string
  ) {
    super(color, xPosition, yPosition, p5);
    this.src = src;
  }

  load() {
    this.image = this.p5.loadImage(this.src);
  }

  draw(): void {
    if (!this.shouldDraw) {
      return;
    }
    this.p5.push();
    this.p5.translate(this.xPosition, this.yPosition);
    this.p5.rotateY(this.p5.frameCount * 0.03);
    this.p5.image(this.image, 0, 0, 30, 30);
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
    this.p5.textSize(20);
    this.p5.text(`x${this.speed * 2}`, this.xPosition, this.yPosition);
    this.p5.pop();
  }
}

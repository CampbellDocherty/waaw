import * as p from '@p5-wrapper/react';
import cd from '../images/cd.png';

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
    const left = -innerWidth / 2 + 80;
    const right = innerWidth / 2 - 80;
    const top = -innerHeight / 2 + 80;
    const bottom = innerHeight / 2 - 80;
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

export class TrackPowerUp extends PowerUp {
  image: any;
  audio: any;
  declare button: any;
  src: string;
  title: string;
  artist: string;
  audioSrc: string;

  constructor(
    p5: p.P5CanvasInstance,
    src: string,
    title: string,
    artist: string,
    audioSrc: string
  ) {
    super('#000', 0, 0, p5);
    this.src = src;
    this.title = title;
    this.artist = artist;
    this.audioSrc = audioSrc;
  }

  loadImage() {
    this.image = this.p5.loadImage(this.src);
  }

  createAudio() {
    this.audio = this.p5.createAudio(this.audioSrc);
  }

  createButton() {
    this.button = this.p5.createButton('');
    this.button.addClass('track-button');
    const imageSpan = this.p5.createSpan();
    imageSpan.addClass('track-button-image');
    imageSpan.style('background-image', `url(${cd})`);
    this.button.child(imageSpan);
    const title = `${this.title.toLowerCase().replace(/\s+/g, '-')}.mp3`;
    const titleSpan = this.p5.createSpan(title);
    imageSpan.addClass('track-button-title');
    this.button.child(titleSpan);
    this.button.hide();
  }

  showButton() {
    this.button.show();
    this.button.style('display', 'flex');
  }

  draw(): void {
    if (!this.shouldDraw) {
      return;
    }
    if (this.hasBeenCollected) {
      const m = this.p5.createVector(this.xPosition - 0, this.yPosition - 100);
      //This sets the magnitude so that it moves in a constant rate but in the right direction.
      m.normalize();
      //Set d equal to the speed
      this.xPosition -= m.x * 10;
      this.yPosition -= m.y * 10;
      this.p5.push();
      this.p5.image(this.image, this.xPosition, this.yPosition, 24, 30);
      this.p5.pop();
      return;
    }
    this.p5.push();
    this.p5.translate(this.xPosition, this.yPosition);
    this.p5.rotateY(this.p5.frameCount * 0.03);
    this.p5.image(this.image, 0, 0, 24, 30);
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

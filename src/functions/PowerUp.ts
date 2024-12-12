import p5Type from 'p5';
import { getRandomNumber } from './getRandomNumber';

export class PowerUp {
  color: string;
  xPosition: number;
  yPosition: number;
  p5: p5Type;
  shouldDraw = false;
  hasBeenCollected = false;
  button: p5Type.Element | null = null;
  width: number;
  height: number;

  constructor(
    color: string,
    xPosition: number,
    yPosition: number,
    p5: p5Type,
    width: number,
    height: number
  ) {
    this.color = color;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.p5 = p5;
    this.width = width;
    this.height = height;
  }

  bindToButton = (button: p5Type.Element): void => {
    this.button = button;
  };

  setPositionWithinBounds = () => {
    const left = -this.p5.width / 4 + 40;
    const right = this.p5.width / 4 - 40;
    const top = -this.p5.height / 2 + 40;
    const bottom = this.p5.height / 2 - 40;
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
    const farLeftOfCircle = this.xPosition - this.width / 2;
    const farRightOfCircle = this.xPosition + this.width / 2;
    const topOfCircle = this.yPosition - this.height / 2;
    const bottomOfCircle = this.yPosition + this.height / 2;

    return {
      left: farLeftOfCircle,
      right: farRightOfCircle,
      top: topOfCircle,
      bottom: bottomOfCircle,
    };
  }
}

export class ColourPowerUp extends PowerUp {
  constructor(color: string, xPosition: number, yPosition: number, p5: p5Type) {
    const width = 20;
    super(color, xPosition, yPosition, p5, width, width);
  }

  draw(): void {
    if (!this.shouldDraw) {
      return;
    }
    this.p5.push();
    this.p5.fill(this.color);
    this.p5.circle(this.xPosition, this.yPosition, this.width);
    this.p5.pop();
  }
}

export class TrackPowerUp extends PowerUp {
  image: p5Type.Image;
  audio: p5Type.MediaElement;
  button: p5Type.Element;
  title: string;
  artist: string;
  rotationSpeed = getRandomNumber(0.03, 0.1);

  constructor({
    p5,
    src,
    title,
    artist,
    audioSrc,
  }: {
    p5: p5Type;
    src: string;
    title: string;
    artist: string;
    audioSrc: string;
  }) {
    const width = 24;
    const height = 30;
    super('#000', 0, 0, p5, width, height);
    this.image = this.p5.loadImage(src);
    this.title = title;
    this.artist = artist;
    this.audio = this.p5.createAudio(audioSrc);
    this.button = this.createButton(src);
  }

  createButton(src: string) {
    const button = this.p5.createButton('');
    button.addClass('track-button');
    const imageSpan = this.p5.createSpan();
    imageSpan.addClass('track-button-image');
    imageSpan.style('background-image', `url(${src})`);
    button.child(imageSpan);
    const title = `${this.title.toLowerCase().replace(/\s+/g, '-')}.mp3`;
    const titleSpan = this.p5.createSpan(title);
    imageSpan.addClass('track-button-title');
    button.child(titleSpan);
    button.hide();
    return button;
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

      m.normalize();
      this.xPosition -= m.x * 10;
      this.yPosition -= m.y * 10;

      if (this.xPosition > -10 && this.xPosition < 1 && this.yPosition < 120) {
        this.shouldDraw = false;
        return;
      }

      this.p5.push();
      this.p5.image(
        this.image,
        this.xPosition,
        this.yPosition,
        this.width,
        this.height
      );
      this.p5.pop();
      return;
    }
    this.p5.push();
    this.p5.translate(this.xPosition, this.yPosition);
    this.p5.rotateY(this.p5.frameCount * this.rotationSpeed);
    this.p5.image(this.image, 0, 0, this.width, this.height);
    this.p5.pop();
  }
}

import * as p from '@p5-wrapper/react';

type AudioFile = {
  audio: HTMLAudioElement | null;
  title: string;
  artist: string;
};

export class CompactDisk {
  x: number;
  y: number;
  src: string;
  p5: p.P5CanvasInstance;
  audio: AudioFile | null = null;
  image = null;
  shouldDraw = false;
  hasCollected = false;

  constructor(x: number, y: number, p5: p.P5CanvasInstance, src: string) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.p5 = p5;
  }

  load() {
    this.image = this.p5.loadImage(this.src);
  }

  loadAudio(audioFile: AudioFile) {
    this.audio = audioFile;
  }

  play() {
    console.log(this.hasCollected, this.audio);
    if (!this.hasCollected) {
      return;
    }
    this.audio?.audio?.play();
  }

  checkIfColliding(x: number, y: number): boolean {
    const { left, right, top, bottom } = this.boundingBox;
    return x > left && x < right && y > top && y < bottom;
  }

  draw() {
    if (!this.shouldDraw) {
      return;
    }
    if (this.hasCollected) {
      this.p5.push();

      // draw image
      this.p5.imageMode(this.p5.CENTER);
      const xCenterOfDisk = -this.p5.width / 2 + 30;
      const yCenterOfDisk = -this.p5.height / 2 + 30;
      this.p5.image(this.image, xCenterOfDisk, yCenterOfDisk, 30, 30);

      // draw song title
      this.p5.fill('white');
      this.p5.textSize(12);
      this.p5.text(this.audio?.title, xCenterOfDisk + 20, yCenterOfDisk - 4);

      // draw song artist
      this.p5.textSize(10);
      this.p5.text(this.audio?.artist, xCenterOfDisk + 20, yCenterOfDisk + 10);

      this.p5.pop();
      return;
    }
    this.p5.push();
    this.p5.imageMode(this.p5.CENTER);
    this.p5.translate(this.x, this.y);
    this.p5.rotateY(this.p5.frameCount * 0.03);
    this.p5.image(this.image, 0, 0, 30, 30);
    this.p5.pop();
  }

  private get boundingBox() {
    const farLeftOfCircle = this.x - 15;
    const farRightOfCircle = this.x + 15;
    const topOfCircle = this.y - 15;
    const bottomOfCircle = this.y + 15;
    return {
      left: farLeftOfCircle,
      right: farRightOfCircle,
      top: topOfCircle,
      bottom: bottomOfCircle,
    };
  }
}

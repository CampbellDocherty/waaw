import p5 from 'p5';
import { PowerUp } from './PowerUp';

export class FinalMix extends PowerUp {
  imgSrc: string;
  finalMixSrc: string;
  p5: p5;
  img: p5.Image | null = null;
  alpha = 0;
  rotationSpeed = 0;
  downloadTriggered = false;

  constructor(imgSrc: string, finalMixSrc: string, p5: p5) {
    super('white', 0, 0, p5, 35, 35);
    this.imgSrc = imgSrc;
    this.p5 = p5;
    this.finalMixSrc = finalMixSrc;
    this.rotationSpeed = this.p5.random(0.03, 0.1);
    this.#load();
    this.shouldDraw = true;
  }

  #load() {
    this.img = this.p5.loadImage(this.imgSrc, () => {
      return;
    });
  }

  draw() {
    if (!this.img || !this.shouldDraw) {
      return;
    }

    this.p5.push();
    this.p5.tint(255, 215, 0, this.alpha);
    this.p5.rotateY(this.p5.frameCount * this.rotationSpeed);
    this.p5.image(this.img, 0, 0, 35, 35);
    this.alpha += 2;
    this.p5.pop();
  }
}

import p5Type from 'p5';

export class Font {
  p5: p5Type;
  font: p5Type.Font | null = null;

  constructor(p5: p5Type) {
    this.p5 = p5;
  }

  loadFont(font: string): void {
    this.font = this.p5.loadFont(font);
  }
}

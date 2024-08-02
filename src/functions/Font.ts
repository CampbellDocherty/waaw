import * as p from '@p5-wrapper/react';

export class Font {
  p5: p.P5CanvasInstance;
  font: any | null = null;

  constructor(p5: p.P5CanvasInstance) {
    this.p5 = p5;
  }

  loadFont(font: string): void {
    this.font = this.p5.loadFont(font);
  }
}

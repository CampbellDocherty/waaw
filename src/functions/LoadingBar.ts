import * as p from '@p5-wrapper/react';
import { Link } from './Link';

export class LoadingBar {
  width = 0;
  p5: p.P5CanvasInstance;
  x = 0;
  y = 0;
  finalWidth = 100;
  height = 10;
  color = '#f7b102';
  progress = 1;

  bindToP5Instance(p5: p.P5CanvasInstance): void {
    this.p5 = p5;
  }

  private onLoad = (url: string): void => {
    const aTags = document.getElementsByTagName('a');
    for (const a of aTags) {
      if (a.href === url) {
        a.click();
      }
    }
    this.width = 0;
  };

  reset = (): void => {
    this.width = 0;
  };

  draw = (link: Link): void => {
    this.width += this.progress;
    if (this.width >= this.finalWidth) {
      this.width = this.finalWidth;
      link.shouldBeLink = true;
      link.show();
      this.onLoad(link.url);
    }
    this.p5.push();
    this.p5.fill(this.color);
    this.p5.rectMode(this.p5.CENTER);
    this.p5.rect(this.x, this.y, this.width, this.height);
    this.p5.pop();
  };
}

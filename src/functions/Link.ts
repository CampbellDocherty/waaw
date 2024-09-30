import * as p from '@p5-wrapper/react';

export class Link {
  p5: p.P5CanvasInstance;
  yOffset: number;
  href: string;
  text: string;
  a: any;

  constructor({
    p5,
    yOffset,
    href,
    text,
  }: {
    p5: p.P5CanvasInstance;
    yOffset: number;
    href: string;
    text: string;
  }) {
    this.yOffset = yOffset;
    this.href = href;
    this.p5 = p5;
    this.text = text;
  }

  create() {
    this.a = this.p5.createA(this.href, this.text, '_blank');
    this.a.position(
      -this.p5.width / 4 - this.a.width / 2,
      this.p5.height / 2 + this.yOffset - this.a.height / 2
    );
  }
}

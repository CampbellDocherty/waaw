import * as p from '@p5-wrapper/react';

export class Link {
  text: string;
  fontSize: number;
  color = 'white';
  xPos: number;
  yPos: number;
  p5: p.P5CanvasInstance;
  url: string;
  isSelected = false;
  link: any;
  shouldBeLink = false;

  constructor(
    text: string,
    fontSize: number,
    xPos: number,
    yPos: number,
    p5: p.P5CanvasInstance,
    url: string
  ) {
    this.text = text;
    this.fontSize = fontSize;
    this.xPos = xPos;
    this.yPos = yPos;
    this.p5 = p5;
    this.url = url;
  }

  updateColor = (newColor: string): void => {
    this.color = newColor;
  };

  checkIfColliding = (x: number, y: number): boolean => {
    if (this.shouldBeLink) {
      return false;
    }
    const { left, right, top, bottom } = this.boundingBox;
    return x > left && x < right && y > top && y < bottom;
  };

  create = () => {
    const center = this.p5.createVector(this.p5.width / 2, this.p5.height / 2);
    const link = this.p5.createA(this.url, this.text, '_blank');
    link.position(center.x + this.xPos, center.y + this.yPos);
    link.style('transform', 'translate(-50%, -50%)');
    link.addClass('portfolio-link');
    this.link = link;
  };

  hide = () => {
    this.link.hide();
  };

  show = () => {
    this.link.show();
  };

  draw = (): void => {
    if (this.shouldBeLink) {
      return;
    }
    this.p5.push();
    this.p5.textSize(this.fontSize);
    this.p5.fill(this.color);
    const textWidth = this.p5.textWidth(this.text);
    this.p5.text(this.text, this.xPos - textWidth / 2, this.yPos);
    this.p5.pop();
  };

  private get boundingBox() {
    const textWidth = this.p5.textWidth(this.text);
    const textAscent = this.p5.textAscent();
    const textDescent = this.p5.textDescent();

    const farLeftOfText = this.xPos - textWidth / 2;
    const farRightOfText = this.xPos + textWidth / 2;
    const topOfText = this.yPos - textAscent;
    const bottomOfText = this.yPos + textDescent;

    return {
      left: farLeftOfText,
      right: farRightOfText,
      top: topOfText,
      bottom: bottomOfText,
    };
  }
}

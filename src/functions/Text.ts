import * as p from '@p5-wrapper/react';

export class Text {
  text: string;
  color = 'white';
  xPos: number;
  yPos: number;
  p5: p.P5CanvasInstance;

  constructor(
    text: string,
    xPos: number,
    yPos: number,
    p5: p.P5CanvasInstance
  ) {
    this.text = text;
    this.xPos = xPos;
    this.yPos = yPos;
    this.p5 = p5;
  }

  updateColor = (newColor: string): void => {
    this.color = newColor;
  };

  draw = (): void => {
    this.p5.push();
    this.p5.fill(this.color);
    this.p5.text(this.text, this.xPos, this.yPos);
    this.p5.pop();
  };

  get boundingBox() {
    const textWidth = this.p5.textWidth(this.text);
    const textAscent = this.p5.textAscent();
    const textDescent = this.p5.textDescent();

    const farLeftOfText = this.xPos;
    const farRightOfText = this.xPos + textWidth;
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

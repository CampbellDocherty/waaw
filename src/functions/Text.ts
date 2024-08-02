import * as p from '@p5-wrapper/react';

export class Text {
  text: string;
  fontSize: number;
  color = 'white';
  xPos: number;
  yPos: number;
  p5: p.P5CanvasInstance;

  constructor(
    text: string,
    fontSize: number,
    xPos: number,
    yPos: number,
    p5: p.P5CanvasInstance
  ) {
    this.text = text;
    this.fontSize = fontSize;
    this.xPos = xPos;
    this.yPos = yPos;
    this.p5 = p5;
  }

  draw = (): void => {
    this.p5.push();
    this.p5.textSize(this.fontSize);
    this.p5.fill(this.color);
    const textWidth = this.p5.textWidth(this.text);
    this.p5.text(this.text, this.xPos - textWidth / 2, this.yPos);
    this.p5.pop();
  };
}

export class Link extends Text {
  url: string;
  isSelected = false;
  selectedColor = '#f7b102';

  constructor(
    text: string,
    fontSize: number,
    xPos: number,
    yPos: number,
    p5: p.P5CanvasInstance,
    url: string
  ) {
    super(text, fontSize, xPos, yPos, p5, url);
    this.url = url;
  }

  private updateColor = (newColor: string): void => {
    this.color = newColor;
  };

  checkIfColliding = (x: number, y: number): boolean => {
    const { left, right, top, bottom } = this.boundingBox;
    const isColliding = x > left && x < right && y > top && y < bottom;
    this.isSelected = isColliding;
    this.updateColor(isColliding ? this.selectedColor : 'white');
    return isColliding;
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

import * as p from '@p5-wrapper/react';

export class Slider {
  width: number;
  min: number;
  max: number;
  initial: number;
  p5: p.P5CanvasInstance;
  slider: any = null;

  constructor(
    width: number,
    min: number,
    max: number,
    initial: number,
    p5: p.P5CanvasInstance
  ) {
    this.width = width;
    this.min = min;
    this.max = max;
    this.initial = initial;
    this.p5 = p5;
  }

  create(): void {
    const slider = this.p5.createSlider(this.min, this.max, this.initial);
    slider.position(innerWidth / 2 - this.width / 2, innerHeight - 50);
    slider.style('width', `${this.width}px`);
    slider.style('max-width', `${this.width}px`);
    slider.style('background', 'transparent');
    this.slider = slider;
  }

  remove(): void {
    if (!this.slider) {
      throw new Error('Slider not created yet');
    }
    this.slider.remove();
  }

  value(): number {
    if (!this.slider) {
      throw new Error('Slider not created yet');
    }
    return this.slider.value();
  }
}

import * as p from '@p5-wrapper/react';
import monoRegular from '../fonts/Mono-Regular.ttf';
import { Vector } from './Vector';

const star = (x: number, y: number, p5: p.P5CanvasInstance): void => {
  const radius1 = 20;
  const radius2 = 40;
  const npoints = 5;
  const TWO_PI = 2 * Math.PI;
  const angle = TWO_PI / npoints;
  const halfAngle = angle / 2.0;
  p5.beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + p5.cos(a) * radius2;
    let sy = y + p5.sin(a) * radius2;
    p5.vertex(sx, sy);
    sx = x + p5.cos(a + halfAngle) * radius1;
    sy = y + p5.sin(a + halfAngle) * radius1;
    p5.vertex(sx, sy);
  }
  p5.endShape('close');
};

export const sketch = (p5: p.P5CanvasInstance, vector: Vector): void => {
  let font: any;

  p5.preload = () => {
    font = p5.loadFont(monoRegular);
  };

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight, p5.WEBGL);
    p5.textSize(32);
    p5.textFont(font);
  };

  window.addEventListener('resize', () => {
    p5.resizeCanvas(innerWidth, innerHeight, p5.WEBGL);
  });

  p5.draw = () => {
    p5.background(102);

    p5.push();
    const { x, y } = vector.position;
    if (x === 0 && y === 0) {
      p5.rotate(p5.frameCount / -100.0);
    }
    star(x, y, p5);
    p5.pop();

    vector.updatePosition(x, y);

    p5.text('WAAW', -40, -60);
  };
};

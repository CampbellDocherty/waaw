import * as p from '@p5-wrapper/react';
import monoRegular from '../fonts/Mono-Regular.ttf';
import { Vector } from './Vector';
import { Text } from './Text';

const star = (
  x: number,
  y: number,
  p5: p.P5CanvasInstance
): { x: number; y: number }[] => {
  const radius1 = 20;
  const radius2 = 40;
  const npoints = 5;
  const TWO_PI = 2 * Math.PI;
  const angle = TWO_PI / npoints;
  const halfAngle = angle / 2.0;

  const vertices = [];
  p5.beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + p5.cos(a) * radius2;
    let sy = y + p5.sin(a) * radius2;
    vertices.push({ x: sx, y: sy });
    p5.vertex(sx, sy);
    sx = x + p5.cos(a + halfAngle) * radius1;
    sy = y + p5.sin(a + halfAngle) * radius1;
    vertices.push({ x: sx, y: sy });
    p5.vertex(sx, sy);
  }
  p5.endShape(p5.CLOSE);
  return vertices;
};

export const sketch = (p5: p.P5CanvasInstance, vector: Vector): void => {
  let font: any;
  const pressedKeys: { [key: string]: boolean } = {};

  p5.preload = () => {
    font = p5.loadFont(monoRegular);
  };

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight, p5.WEBGL);
    p5.textSize(32);
    p5.textFont(font);
  };

  p5.keyPressed = (event: { key: string }) => {
    pressedKeys[event.key] = true;
  };

  p5.keyReleased = (event: { key: string }) => {
    pressedKeys[event.key] = false;
  };

  window.addEventListener('resize', () => {
    p5.resizeCanvas(innerWidth, innerHeight, p5.WEBGL);
  });

  const text = new Text('WAAW', -40, -60, p5);
  p5.draw = () => {
    p5.background(102);

    text.draw();

    if (pressedKeys['ArrowLeft']) {
      vector.updateVelocity(-15, 0);
    }
    if (pressedKeys['ArrowRight']) {
      vector.updateVelocity(15, 0);
    }
    if (pressedKeys['ArrowUp']) {
      vector.updateVelocity(0, -15);
    }
    if (pressedKeys['ArrowDown']) {
      vector.updateVelocity(0, 15);
    }

    if (!Object.values(pressedKeys).some((value) => value)) {
      vector.updateVelocity(0, 0);
    }

    p5.push();
    const starWidth = 40;
    vector.constrain(innerWidth, innerHeight, starWidth, p5);
    const { x, y } = vector.position;
    if (x === 0 && y === 0) {
      p5.rotate(p5.frameCount / -100.0);
    }
    const starVertices = star(x, y, p5);
    p5.pop();

    const isColliding = starVertices.some((vertex) => {
      const { x, y } = vertex;
      const { left, right, top, bottom } = text.boundingBox;
      return x > left && x < right && y > top && y < bottom;
    });

    if (isColliding) {
      text.updateColor('#f7b102');
    } else {
      text.updateColor('white');
    }

    vector.updatePosition(x, y);
  };
};

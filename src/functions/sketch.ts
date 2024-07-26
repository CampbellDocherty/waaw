import * as p from '@p5-wrapper/react';
import monoRegular from '../fonts/Mono-Regular.ttf';
import { Star } from './Star';
import { Text } from './Text';

export const sketch = (p5: p.P5CanvasInstance, star: Star): void => {
  let font: any;
  const pressedKeys: { [key: string]: boolean } = {};

  p5.preload = () => {
    font = p5.loadFont(monoRegular);
    star.bindToP5Instance(p5);
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

  const waawText = new Text('WAAW', -40, -60, p5);

  p5.draw = () => {
    p5.background(102);

    _drawByKeyPress(pressedKeys, star);

    waawText.draw();

    p5.push();
    const { x, y } = star.position;
    if (x === 0 && y === 0) {
      p5.rotate(p5.frameCount / -100.0);
    }
    const starVertices = star.draw(p5);
    p5.pop();

    const texts = [waawText];

    for (const text of texts) {
      const isColliding = starVertices.some((vertex) => {
        const { x, y } = vertex;
        return text.checkIfColliding(x, y);
      });

      if (isColliding) {
        text.updateColor('#f7b102');
      } else {
        text.updateColor('white');
      }
    }

    star.updatePosition(x, y);
  };
};

const _drawByKeyPress = (
  pressedKeys: { [key: string]: boolean },
  star: Star
) => {
  if (pressedKeys['ArrowLeft']) {
    star.updateVelocity(-15, 0);
  }
  if (pressedKeys['ArrowRight']) {
    star.updateVelocity(15, 0);
  }
  if (pressedKeys['ArrowUp']) {
    star.updateVelocity(0, -15);
  }
  if (pressedKeys['ArrowDown']) {
    star.updateVelocity(0, 15);
  }

  if (!Object.values(pressedKeys).some((value) => value)) {
    star.updateVelocity(0, 0);
  }
};

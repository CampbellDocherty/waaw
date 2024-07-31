import * as p from '@p5-wrapper/react';
import monoRegular from '../fonts/Mono-Regular.ttf';
import { Star } from './Star';
import { Text } from './Text';
import { LoadingBar } from './LoadingBar';
import { PowerUp } from './PowerUp';

export const sketch = (p5: p.P5CanvasInstance, star: Star): void => {
  let font: any;
  const pressedKeys: { [key: string]: boolean } = {};
  const loadingBar = new LoadingBar();

  const colourPowerUps = createColourPowerUps(p5, [
    'red',
    'blue',
    'green',
    'yellow',
  ]);

  p5.preload = () => {
    font = p5.loadFont(monoRegular);
    star.bindToP5Instance(p5);
    loadingBar.bindToP5Instance(p5);
  };

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight, p5.WEBGL);
    p5.textSize(24);
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

  const waawText = new Text('WAAW', 0, -60, p5, '');
  const instagramText = new Text(
    'Instagram',
    -innerWidth / 4,
    -innerHeight / 4,
    p5,
    'https://www.instagram.com/waawdj/'
  );
  const mixcloudText = new Text(
    'Mixcloud',
    innerWidth / 4,
    -innerHeight / 4,
    p5,
    'https://www.mixcloud.com/waawtwins/stream/'
  );
  const soundcloudText = new Text(
    'Soundcloud',
    -innerWidth / 4,
    innerHeight / 4,
    p5,
    'https://soundcloud.com/waawdj'
  );

  const texts = [instagramText, mixcloudText, soundcloudText];

  p5.draw = () => {
    p5.background(102);

    _drawByKeyPress(pressedKeys, star);

    waawText.draw();
    texts.forEach((text) => {
      text.draw();
    });

    p5.push();
    const { x, y } = star.position;
    if (x === 0 && y === 0) {
      p5.rotate(p5.frameCount / -100.0);
    }
    const starVertices = star.draw(p5);
    p5.pop();

    for (const text of texts) {
      const isColliding = starVertices.some((vertex) => {
        const { x, y } = vertex;
        return text.checkIfColliding(x, y);
      });

      if (isColliding) {
        text.updateColor('#f7b102');
        text.isSelected = true;
        loadingBar.draw(text.url);
      } else {
        text.updateColor('white');
        text.isSelected = false;
      }
    }

    for (const powerUp of colourPowerUps) {
      powerUp.draw();
      const isColliding = starVertices.some((vertex) => {
        const { x, y } = vertex;
        return powerUp.checkIfColliding(x, y);
      });

      if (isColliding) {
        const powerUpColour = powerUp.color;
        star.updateColour(powerUpColour);
        powerUp.remove();
      }
    }

    const selectedText = texts.find((text) => text.isSelected);
    if (!selectedText) {
      loadingBar.reset();
    }

    star.updatePosition(x, y);

    // p5.push();
    // // Rotate around the y-axis.
    // p5.rotateY(p5.frameCount * 0.03);

    // // Draw the square.
    // p5.square(-20, 70, 30);
    // p5.pop();
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

  // if (!Object.values(pressedKeys).some((value) => value)) {
  //   star.updateVelocity(0, 0);
  // }
};

function createColourPowerUps(
  p5: p.P5CanvasInstance,
  colours: string[]
): PowerUp[] {
  const timeBetweenPowerUps = 3000;
  const colourPowerUps = colours.map((colour, index) => {
    const powerUp = new PowerUp(colour, 0, 0, p5);
    setTimeout(() => {
      powerUp.setPositionWithinBounds(
        -innerWidth / 2,
        innerWidth / 2,
        -innerHeight / 2,
        innerHeight / 2
      );
      powerUp.shouldDraw = true;
    }, timeBetweenPowerUps * (index + 1));
    return powerUp;
  });

  return colourPowerUps;
}

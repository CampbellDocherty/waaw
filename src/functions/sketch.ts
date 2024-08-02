import * as p from '@p5-wrapper/react';
import song from '../audio/last-kiss.mp3';
import monoRegular from '../fonts/Mono-Regular.ttf';
import cdImage from '../images/cd.png';
import { CompactDisk } from './CompactDisk';
import { Font } from './Font';
import { LoadingBar } from './LoadingBar';
import { PowerUp } from './PowerUp';
import { Slider } from './Slider';
import { Star } from './Star';
import { Text } from './Text';

export const sketch = (p5: p.P5CanvasInstance, star: Star): void => {
  let start = false;
  const pressedKeys: { [key: string]: boolean } = {};

  const font = new Font(p5);
  const loadingBar = new LoadingBar();
  const slider = new Slider(300, 20, 100, 50, p5);
  const image = new CompactDisk(0, 0, p5, cdImage);

  const colourPowerUps = createColourPowerUps(p5, 5);

  p5.mouseClicked = () => {
    if (!start) {
      slider.create();
      start = true;
    }
  };

  p5.touchStarted = () => {
    if (!start) {
      slider.create();
      start = true;
    }
  };

  p5.preload = () => {
    font.loadFont(monoRegular);
    star.bindToP5Instance(p5);
    image.load();
    image.loadAudio(song);
    loadingBar.bindToP5Instance(p5);
  };

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight, p5.WEBGL);
    p5.textFont(font.font);
  };

  p5.keyPressed = (event: { key: string }) => {
    pressedKeys[event.key] = true;
  };

  p5.keyReleased = (event: { key: string }) => {
    pressedKeys[event.key] = false;
  };

  p5.windowResized = () => {
    p5.resizeCanvas(innerWidth, innerHeight, p5.WEBGL);
    slider.remove();
    slider.create();
  };

  const waawText = new Text('WAAW', 24, 0, -60, p5, '');
  const clickMeText = new Text('Click to start!', 12, 0, 70, p5, '');

  const texts = createTexts(p5);

  p5.draw = () => {
    p5.background(102);

    // speed control
    const sliderValue = slider.value();
    star.updateSpeed(sliderValue / 100);

    // key presses for web
    _drawByKeyPress(pressedKeys, star);

    // draw texts
    waawText.draw();
    if (!start) clickMeText.draw();
    texts.forEach((text) => {
      if (start) {
        text.draw();
      }
    });

    // draw star
    const starVertices = star.draw(p5, !start);

    // check for text collisions
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

    // check for powerup collisions
    for (const powerUp of colourPowerUps) {
      if (!start) return;
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

    // reset loading bar if no text is selected
    const selectedText = texts.find((text) => text.isSelected);
    if (!selectedText) {
      loadingBar.reset();
    }

    // draw compact disk if all powerups have been collected
    const collectedPowerUps = colourPowerUps.filter(
      (powerUp) => powerUp.hasBeenCollected
    );
    if (collectedPowerUps.length === colourPowerUps.length) {
      image.draw();
    }

    // if star collides with compact disk
    const isColliding = starVertices.some((vertex) => {
      const { x, y } = vertex;
      return image.checkIfColliding(x, y);
    });
    if (isColliding) {
      image.play();
    }

    // update star position
    star.updatePosition();
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

const createTexts = (p5: p.P5CanvasInstance): Text[] => {
  const instagramText = new Text(
    'Instagram',
    20,
    -innerWidth / 4,
    -innerHeight / 4,
    p5,
    'https://www.instagram.com/waawdj/'
  );
  const mixcloudText = new Text(
    'Mixcloud',
    20,
    innerWidth / 4,
    -innerHeight / 4,
    p5,
    'https://www.mixcloud.com/waawtwins/stream/'
  );
  const soundcloudText = new Text(
    'Soundcloud',
    20,
    -innerWidth / 4,
    innerHeight / 4,
    p5,
    'https://soundcloud.com/waawdj'
  );

  return [instagramText, mixcloudText, soundcloudText];
};

const createColourPowerUps = (
  p5: p.P5CanvasInstance,
  amount: number
): PowerUp[] => {
  const timeBetweenPowerUps = 3000;
  const colours = Array.from({ length: amount }, () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  });
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
};

import * as p from '@p5-wrapper/react';
import { RefObject } from 'react';
import monoRegular from '../fonts/Mono-Regular.ttf';
import cdImage from '../images/cd.png';
import { CompactDisk } from './CompactDisk';
import { Font } from './Font';
import { LoadingBar } from './LoadingBar';
import { ColourPowerUp, SpeedPowerUp } from './PowerUp';
import { Star } from './Star';
import { Text } from './Text';

export const sketch = (
  p5: p.P5CanvasInstance,
  star: Star,
  audioRef: RefObject<HTMLAudioElement>,
  onStart: () => Promise<void>
): void => {
  let start = false;
  const pressedKeys: { [key: string]: boolean } = {};

  const font = new Font(p5);
  const loadingBar = new LoadingBar();
  const cd = new CompactDisk(0, 0, p5, cdImage);

  const colourPowerUps = createColourPowerUps(p5, 5);
  const speedPowerUps = createSpeedPowerUps(p5);

  p5.preload = () => {
    font.loadFont(monoRegular);
    star.bindToP5Instance(p5);
    cd.load();
    cd.loadAudio({
      audio: audioRef?.current,
      title: 'Last Kiss',
      artist: 'James Massiah',
    });
    loadingBar.bindToP5Instance(p5);
  };

  const texts = createTexts(p5);

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight, p5.WEBGL);
    p5.textFont(font.font);
    for (const text of texts) {
      p5.createA(text.url, text.text, '_blank');
    }

    const button = p5.createButton('Click to start!');
    const buttonWidth = p5.width;
    const buttonHeight = p5.height * 2;
    button.style('width', `${buttonWidth}px`);
    button.style('height', `${buttonHeight}px`);
    button.addClass('start-button');
    button.position(
      innerWidth / 2 - buttonWidth / 2,
      innerHeight / 2 + 70 - button.height / 2
    );
    button.mousePressed(async () => {
      await onStart();
      start = true;
      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      button.hide();
    });
  };

  p5.keyPressed = (event: { key: string }) => {
    pressedKeys[event.key] = true;
  };

  p5.keyReleased = (event: { key: string }) => {
    pressedKeys[event.key] = false;
  };

  p5.windowResized = () => {
    p5.resizeCanvas(innerWidth, innerHeight, p5.WEBGL);
  };

  const waawText = new Text('WAAW', 24, 0, -60, p5, '');

  p5.draw = () => {
    p5.background(102);

    // key presses for web
    _drawByKeyPress(pressedKeys, star);

    // draw texts
    waawText.draw();
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

    // check for colour powerup collisions
    for (const colourPowerUp of colourPowerUps) {
      if (!start) return;
      colourPowerUp.draw();
      const isColliding = starVertices.some((vertex) => {
        const { x, y } = vertex;
        return colourPowerUp.checkIfColliding(x, y);
      });

      if (isColliding) {
        const powerUpColour = colourPowerUp.color;
        star.updateColour(powerUpColour);
        colourPowerUp.remove();
      }
    }

    // check for speed powerup collisions
    for (const speedPowerUp of speedPowerUps) {
      if (!start) return;
      speedPowerUp.draw();
      const isColliding = starVertices.some((vertex) => {
        const { x, y } = vertex;
        return speedPowerUp.checkIfColliding(x, y);
      });

      if (isColliding) {
        const powerUpSpeed = speedPowerUp.speed;
        star.updateSpeed(powerUpSpeed);
        speedPowerUp.remove();
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
      cd.shouldDraw = true;
      cd.draw();
    }

    // if star collides with compact disk
    const isColliding = starVertices.some((vertex) => {
      const { x, y } = vertex;
      return cd.checkIfColliding(x, y);
    });
    if (isColliding && cd.shouldDraw) {
      console.log('collected');
      cd.hasCollected = true;
      cd.play();
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
): ColourPowerUp[] => {
  const timeBetweenPowerUps = 3000;
  const colours: string[] = [];

  while (colours.length < amount) {
    const randomColour = `#${Math.floor(Math.random() * 16777215).toString(
      16
    )}`;
    if (colours.includes(randomColour)) continue;
    if (randomColour === '#ffffff') continue;
    colours.push(randomColour);
  }
  const colourPowerUps = colours.map((colour, index) => {
    const powerUp = new ColourPowerUp(colour, 0, 0, p5);
    setTimeout(() => {
      powerUp.setPositionWithinBounds(
        -innerWidth / 2 + 30,
        innerWidth / 2 - 30,
        -innerHeight / 2 + 30,
        innerHeight / 2 - 30
      );
      powerUp.shouldDraw = true;
    }, timeBetweenPowerUps * (index + 1));
    return powerUp;
  });

  return colourPowerUps;
};

const createSpeedPowerUps = (p5: p.P5CanvasInstance): SpeedPowerUp[] => {
  const timeBetweenPowerUps = 4500;
  const speeds: number[] = [1, 0.25];

  const speedPowerUps = speeds.map((speed, index) => {
    const powerUp = new SpeedPowerUp('#f7b102', speed, 0, 0, p5);
    setTimeout(() => {
      powerUp.setPositionWithinBounds(
        -innerWidth / 2 + 30,
        innerWidth / 2 - 30,
        -innerHeight / 2 + 30,
        innerHeight / 2 - 30
      );
      powerUp.shouldDraw = true;
    }, timeBetweenPowerUps * (index + 1));
    return powerUp;
  });

  return speedPowerUps;
};

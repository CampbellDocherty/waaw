import * as p from '@p5-wrapper/react';
import { RefObject } from 'react';
import monoRegular from '../fonts/Mono-Regular.ttf';
import cdImage from '../images/cd.png';
import theTwins from '../images/the-twins.jpg';
import { CompactDisk } from './CompactDisk';
import { Font } from './Font';
import { LoadingBar } from './LoadingBar';
import { ColourPowerUp, SpeedPowerUp } from './PowerUp';
import { Star } from './Star';
import { Link } from './Link';

export const sketch = (
  p5: p.P5CanvasInstance,
  star: Star,
  audioRef: RefObject<HTMLAudioElement>,
  onStart: () => Promise<void>,
  isProbablyWeb: boolean
): void => {
  let start = false;
  let mainImage: any;

  const pressedKeys: { [key: string]: boolean } = {};

  const font = new Font(p5);
  const loadingBar = new LoadingBar();
  const cd = new CompactDisk(0, -240, p5, cdImage);

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
    mainImage = p5.loadImage(theTwins);
  };

  const colourPowerUps = createColourPowerUps(p5);
  const speedPowerUps = createSpeedPowerUps(p5);
  const links = createlinks(p5);

  let instructionsButton: any;

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight, p5.WEBGL);
    p5.textFont(font.font);
    for (const text of links) {
      text.create();
      text.hide();
    }

    for (const [index, powerUp] of colourPowerUps.entries()) {
      const button = p5.createButton('');
      const height = 40;
      button.style('width', `${height}px`);
      button.style('height', `${height}px`);
      button.position(innerWidth - height, index * height);
      button.style('background-color', powerUp.color);
      button.hide();
      button.mousePressed(() => {
        star.updateColour(powerUp.color);
      });
      powerUp.bindToButton(button);
    }

    for (const [index, powerUp] of speedPowerUps.entries()) {
      const button = p5.createButton(`x${powerUp.speed * 2}`);
      const height = 40;
      const width = 60;
      button.style('color', powerUp.color);
      button.style('font-size', '16px');
      button.style('width', `${width}px`);
      button.style('height', `${height}px`);
      button.style('text-align', 'right');
      button.style('padding', 'none');
      button.position(
        innerWidth - width,
        index * height + colourPowerUps.length * height
      );
      button.style('background-color', 'transparent');
      button.style('border', 'none');
      button.style('outline', 'none');

      button.hide();
      button.mousePressed(() => {
        star.updateSpeed(powerUp.speed);
      });
      powerUp.bindToButton(button);
    }

    const button = p5.createButton('Click to start!');
    const buttonWidth = p5.width;
    const buttonHeight = p5.height * 2;
    button.style('width', `${buttonWidth}px`);
    button.style('height', `${buttonHeight}px`);
    button.addClass('start-button');
    button.position(
      innerWidth / 2 - buttonWidth / 2,
      innerHeight / 2 - button.height / 2
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
      instructionsButton = _addInstructions(isProbablyWeb, p5);
    });
  };

  p5.keyPressed = (event: { key: string }) => {
    if (isProbablyWeb) {
      instructionsButton.addClass('hide');
      pressedKeys[event.key] = true;
    }
  };

  p5.keyReleased = (event: { key: string }) => {
    if (isProbablyWeb) {
      pressedKeys[event.key] = false;
    }
  };

  p5.windowResized = () => {
    p5.resizeCanvas(innerWidth, innerHeight, p5.WEBGL);
  };

  p5.draw = () => {
    p5.background(102);

    // key presses for web
    if (isProbablyWeb) {
      _drawByKeyPress(pressedKeys, star);
    }

    p5.push();
    p5.imageMode(p5.CENTER);
    p5.image(mainImage, 0, -120, 140, 170);
    p5.pop();

    // draw texts
    links.forEach((link) => {
      if (start) {
        link.draw();
      }
    });

    // draw star
    const starVertices = star.draw(p5, !start);

    // check for text collisions
    for (const link of links) {
      const isColliding = starVertices.some((vertex) => {
        const { x, y } = vertex;
        return link.checkIfColliding(x, y);
      });

      if (isColliding) {
        link.updateColor('#f7b102');
        link.isSelected = true;
        loadingBar.draw(link);
      } else {
        link.updateColor('white');
        link.isSelected = false;
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
    const selectedText = links.find((text) => text.isSelected);
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

  if (!Object.values(pressedKeys).some((value) => value)) {
    star.updateVelocity(0, 0);
  }
};

const createlinks = (p5: p.P5CanvasInstance): Link[] => {
  const instagramText = new Link(
    'Instagram',
    18,
    -0,
    50,
    p5,
    'https://www.instagram.com/waawdj/'
  );
  const mixcloudText = new Link(
    'Mixcloud',
    18,
    0,
    125,
    p5,
    'https://www.mixcloud.com/waawtwins/stream/'
  );
  const soundcloudText = new Link(
    'Soundcloud',
    18,
    -0,
    200,
    p5,
    'https://soundcloud.com/waawdj'
  );

  return [instagramText, mixcloudText, soundcloudText];
};

const createColourPowerUps = (p5: p.P5CanvasInstance): ColourPowerUp[] => {
  const timeBetweenPowerUps = 3000;
  const colours: string[] = [
    '#edf67d',
    '#f896d8',
    '#ca7df9',
    '#724cf9',
    '#564592',
  ];
  const colourPowerUps = colours.map((colour, index) => {
    const powerUp = new ColourPowerUp(colour, 0, 0, p5);
    setTimeout(() => {
      powerUp.setPositionWithinBounds();
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
    const powerUp = new SpeedPowerUp('#b2f602', speed, 0, 0, p5);
    setTimeout(() => {
      powerUp.setPositionWithinBounds();
      powerUp.shouldDraw = true;
    }, timeBetweenPowerUps * (index + 1));
    return powerUp;
  });

  return speedPowerUps;
};

const _addInstructions = (isProbablyWeb: boolean, p5: any) => {
  const instructionText = isProbablyWeb
    ? 'Collect the powerups using the arrow keys :)'
    : 'Collect the powerups by tilting your device :)';
  const instructions = p5.createButton(instructionText);
  instructions.addClass('start-button');
  instructions.position(
    innerWidth / 2 - instructions.width / 2,
    innerHeight / 2 - instructions.height / 2
  );

  if (!isProbablyWeb) {
    setTimeout(() => {
      instructions.hide();
    }, 2000);
  }
  return instructions;
};

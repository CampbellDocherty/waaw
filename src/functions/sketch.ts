import * as p from '@p5-wrapper/react';
import { RefObject } from 'react';
import monoRegular from '../fonts/Mono-Regular.ttf';
import cdImage from '../images/cd.png';
import folder from '../images/folder.png';
import theTwins from '../images/the-twins.jpg';
import { CompactDisk } from './CompactDisk';
import { Font } from './Font';
import { ColourPowerUp, SpeedPowerUp } from './PowerUp';
import { Star } from './Star';

export const sketch = (
  p5: p.P5CanvasInstance,
  star: Star,
  audioRef: RefObject<HTMLAudioElement>,
  onStart: () => Promise<void>,
  isProbablyWeb: boolean
): void => {
  let start = false;
  let mainImage: any;
  let folderImage: any;

  const pressedKeys: { [key: string]: boolean } = {};

  const font = new Font(p5);
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
    mainImage = p5.loadImage(theTwins);
    folderImage = p5.loadImage(folder);
  };

  const colourPowerUps = createColourPowerUps(p5);
  const speedPowerUps = createSpeedPowerUps(p5);

  let instructionsButton: any;
  let colourPowerUpInstructions: any;

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight, p5.WEBGL);
    p5.textFont(font.font);

    colourPowerUpInstructions = p5.createP(
      isProbablyWeb ? 'Click to power up ->' : 'Press to power up ->'
    );

    for (const [index, powerUp] of colourPowerUps.entries()) {
      const button = p5.createButton('');
      const height = 40;
      button.style('width', `${height}px`);
      button.style('height', `${height}px`);
      button.position(innerWidth - height, index * height);
      button.style('background-color', powerUp.color);
      button.addClass('hide-button');
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

    const button = p5.createButton(
      isProbablyWeb ? 'Click to start!' : 'Press to start!'
    );
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
    p5.imageMode(p5.CENTER);
  };

  p5.keyPressed = (event: { key: string }) => {
    if (isProbablyWeb) {
      if (instructionsButton) {
        instructionsButton.addClass('hide');
      }
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
    if (start) p5.image(folderImage, -190, 160, 90, 60);
    p5.pop();

    // draw star
    const starVertices = star.draw(p5, !start);

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

    colourPowerUpInstructions.position(
      innerWidth - 240,
      100 - colourPowerUpInstructions.height / 2
    );
    colourPowerUpInstructions.addClass('hidden');

    // draw compact disk if all powerups have been collected
    const collectedPowerUps = colourPowerUps.filter(
      (powerUp) => powerUp.hasBeenCollected
    );
    if (collectedPowerUps.length === colourPowerUps.length) {
      if (!colourPowerUpInstructions.elt.classList.contains('hide')) {
        colourPowerUpInstructions.addClass('show');
        setTimeout(() => {
          colourPowerUpInstructions.removeClass('show');
          colourPowerUpInstructions.addClass('hide');
        }, 2500);
      }
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

const createColourPowerUps = (p5: p.P5CanvasInstance): ColourPowerUp[] => {
  const timeBetweenPowerUps = 1200;
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
  const timeBetweenPowerUps = 2000;
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

const _addInstructions = (isProbablyWeb: boolean, p5: p.P5CanvasInstance) => {
  const instructionText = isProbablyWeb
    ? 'Collect the powerups using the arrow keys :)'
    : 'Collect the powerups by tilting your device :)';

  const instructions = p5.createP(instructionText);
  instructions.addClass('centered-text');

  if (!isProbablyWeb) {
    setTimeout(() => {
      instructions.addClass('hide');
    }, 2000);
  }
  return instructions;
};

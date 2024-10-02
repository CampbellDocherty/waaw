import * as p from '@p5-wrapper/react';
import { audioFiles } from '../audio/audio';
import monoRegular from '../fonts/Mono-Regular.ttf';
import cdImage from '../images/cd.png';
import folder from '../images/folder.png';
import theTwins from '../images/the-twins.jpg';
import { Font } from './Font';
import { ColourPowerUp, SpeedPowerUp, TrackPowerUp } from './PowerUp';
import { Star } from './Star';
import { FallingRectangle } from './Rectangle';
import { getRandomNumber } from './getRandomNumber';

enum Screen {
  INITIAL = 'initial',
  GAME = 'game',
  SOCIALS = 'socials',
}

export const sketch = (
  p5: p.P5CanvasInstance,
  star: Star,
  onStart: () => Promise<void>,
  isProbablyWeb: boolean
): void => {
  let start = false;
  let allPowerUpsCollected = false;
  let mainImage: any;
  let cd: any;

  let startingX = 0;
  let score = 0;
  let diedInGame = false;

  const pressedKeys: { [key: string]: boolean } = {};

  const font = new Font(p5);
  const trackPowerUps = createTrackPowerUps(p5);

  p5.preload = () => {
    font.loadFont(monoRegular);
    star.bindToP5Instance(p5);
    cd = p5.loadImage(cdImage);
    mainImage = p5.loadImage(theTwins);

    for (const track of trackPowerUps) {
      track.loadImage();
    }
  };

  const colourPowerUps = createColourPowerUps(p5);
  const speedPowerUps = createSpeedPowerUps(p5);
  const rectangles = createRectangles(p5);

  const instructionsButton = p5.select('.instructions');
  const gameScreen = p5.select('.game-screen');
  const socialScreen = p5.select('.social-screen');
  const gameOverScreen = p5.select('.game-over-screen');
  const folderButton = p5.select('.folder-button');
  const tracksText = p5.select('.tracks');
  const socialsButton = p5.select('.top-left');
  const gameButton = p5.select('.top-right');
  const trackContainer = p5.select('.track-container');
  const tracksSection = p5.select('.tracks-section');
  const trackContainerClose = p5.select('.track-container-close');
  const playAgainButton = p5.select('.play-again-button');
  const finalScore = p5.select('.final-score');

  let selectedTrack: TrackPowerUp | null = null;
  let screen: Screen = Screen.INITIAL;

  p5.setup = () => {
    p5.createCanvas(innerWidth * 2, innerHeight, p5.WEBGL);
    p5.textFont(font.font);

    socialsButton.mousePressed(() => {
      screen = Screen.SOCIALS;
    });

    gameButton.mousePressed(() => {
      screen = Screen.GAME;
    });

    playAgainButton.mousePressed(() => {
      selectedTrack = null;
      rectangles.forEach((rectangle) => rectangle.reset());
      gameOverScreen.removeClass('show');
      gameOverScreen.addClass('hide');
      gameOverScreen.style('display', 'none');
      diedInGame = false;
      instructionsButton.removeClass('hide');
      instructionsButton.addClass('show');
    });

    folderButton.style('background-image', `url(${folder})`);
    folderButton.position(
      innerWidth / 2 - folderButton.width / 2,
      innerHeight / 2 - folderButton.height / 2 + 100
    );
    folderButton.mousePressed(() => {
      if (trackContainer.style('display') !== 'none') {
        trackContainer.hide();
      } else {
        trackContainer.show();
      }
    });

    trackContainerClose.mousePressed(() => {
      trackContainer.hide();
    });
    trackContainer.position(40, 40);

    for (const track of trackPowerUps) {
      track.createAudio();
      track.createButton();
      tracksSection.child(track.button);
      const onTrackSelect = () => {
        trackPowerUps.forEach((track) => track.audio.stop());
        selectedTrack = track;
        track.audio.stop();
        track.audio.time = 0;
        track.audio.play();
        if (allPowerUpsCollected) {
          rectangles.forEach((rectangle) => {
            rectangle.shouldDraw = true;
            rectangle.shouldAnimate = true;
          });
        }
        trackContainer.hide();
        instructionsButton.removeClass('show');
        instructionsButton.addClass('hide');
      };
      track.button.mousePressed(onTrackSelect);
      track.button.touchEnded(onTrackSelect);
    }

    const buttons = p5.selectAll('.hide-button');
    for (const [index, powerUp] of colourPowerUps.entries()) {
      const button = buttons[index];
      const height = 40;
      button.style('width', `${height}px`);
      button.style('height', `${height}px`);
      button.position(innerWidth - height, index * height);
      button.style('background-color', powerUp.color);
      button.style('z-index', '9999');
      button.mousePressed(() => {
        star.updateColour(powerUp.color);
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
      button.hide();
      if (!isProbablyWeb) {
        setTimeout(() => {
          instructionsButton.removeClass('show');
          instructionsButton.addClass('hide');
        }, 2000);
      }
    });

    p5.imageMode(p5.CENTER);
  };

  p5.keyPressed = (event: { key: string }) => {
    if (!start) return;
    if (isProbablyWeb) {
      if (instructionsButton && !allPowerUpsCollected) {
        instructionsButton.removeClass('show');
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
    const isPlayingTheGame = allPowerUpsCollected && selectedTrack;

    p5.background(102);

    if (isProbablyWeb) {
      _drawByKeyPress(pressedKeys, star);
    }

    if (!start) {
      p5.image(mainImage, 0, -120, 140, 170);
      star.draw(p5, true);
      return;
    }

    const hiddenElements = p5.selectAll('.hidden');
    for (const hidden of hiddenElements) {
      hidden.removeClass('hidden');
      hidden.addClass('show');
    }

    p5.image(mainImage, 0, -120, 140, 170);

    if (screen === Screen.SOCIALS) {
      let x = (startingX += 50);
      if (x >= innerWidth) {
        startingX = innerWidth;
        x = innerWidth;
      }
      p5.translate(x, 0);

      if (!socialScreen.elt.classList.contains('show-menu')) {
        socialScreen.removeClass('hide-menu');
        socialScreen.addClass('show-menu');
      }

      if (!gameScreen.elt.classList.contains('slide-out-right')) {
        gameScreen.removeClass('slide-in-left');
        gameScreen.addClass('slide-out-right');
      }
    }

    if (screen === Screen.GAME) {
      let x = (startingX -= 50);
      if (x <= 0) {
        startingX = 0;
        x = 0;
      }
      p5.translate(x, 0);
      if (!socialScreen.elt.classList.contains('hide-menu')) {
        socialScreen.removeClass('show-menu');
        socialScreen.addClass('hide-menu');
      }

      if (!gameScreen.elt.classList.contains('slide-in-left')) {
        gameScreen.removeClass('slide-out-right');
        gameScreen.addClass('slide-in-left');
      }
    }

    const starVertices = star.draw(p5, false);

    for (const track of trackPowerUps) {
      track.draw();
      const isCollidingWithTrack = starVertices.some((vertex) => {
        const { x, y } = vertex;
        return track.checkIfColliding(x, y);
      });
      if (isCollidingWithTrack) {
        track.hasBeenCollected = true;
        track.showButton();
      }
    }

    const collectedTracks = trackPowerUps.filter(
      (track) => track.hasBeenCollected
    );

    tracksText.position(
      innerWidth / 2 - folderButton.width / 2,
      innerHeight / 2 - folderButton.height / 2 + 170
    );
    tracksText.html(`Tracks (${collectedTracks.length})`);

    for (const colourPowerUp of colourPowerUps) {
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

    for (const speedPowerUp of speedPowerUps) {
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

    if (isPlayingTheGame) {
      p5.push();
      p5.textAlign(p5.CENTER);
      p5.textSize(14);
      p5.text('Score', 0, -innerHeight / 2 + 30);
      p5.textSize(18);
      p5.text(!diedInGame ? (score += 10) : score, 0, -innerHeight / 2 + 50);
      p5.pop();
    }

    for (const rectangle of rectangles) {
      rectangle.draw();

      const isColliding = starVertices.some((vertex) => {
        const { x, y } = vertex;
        return rectangle.checkIfColliding(x, y);
      });

      if (isColliding) {
        if (star.colour !== rectangle.colour) diedInGame = true;
      }
    }

    if (diedInGame) {
      rectangles.forEach((rectangle) => (rectangle.shouldAnimate = false));
      finalScore.html(score);
      gameOverScreen.style('display', 'flex');
      gameOverScreen.addClass('show');
      selectedTrack?.audio.stop();
    }

    const collectedColours = colourPowerUps.filter(
      (powerUp) => powerUp.hasBeenCollected
    );

    const allPowerUps = [...trackPowerUps, ...colourPowerUps];
    const allCollectedPowerUps = [...collectedColours, ...collectedTracks];
    if (
      allCollectedPowerUps.length === allPowerUps.length &&
      !allPowerUpsCollected &&
      !selectedTrack
    ) {
      instructionsButton.html('Select a track to play');
      instructionsButton.removeClass('hide');
      instructionsButton.addClass('show');
      allPowerUpsCollected = true;
    }

    if (selectedTrack) {
      p5.push();

      p5.imageMode(p5.CENTER);
      const xCenterOfDisk = -p5.width / 4 + 30;
      const yCenterOfDisk = p5.height / 2 - 30;
      const dimension = 40;
      p5.image(cd, xCenterOfDisk, yCenterOfDisk, dimension, dimension);

      p5.fill('white');
      p5.textSize(16);
      p5.text(
        selectedTrack.title,
        xCenterOfDisk + dimension * 0.75,
        yCenterOfDisk - dimension / 8
      );

      p5.textSize(12);
      p5.text(
        selectedTrack.artist,
        xCenterOfDisk + dimension * 0.75,
        yCenterOfDisk + dimension / 4
      );

      p5.pop();
    }

    // update star position
    if (screen === Screen.GAME || (screen === Screen.INITIAL && !diedInGame)) {
      star.updatePosition();
    }
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

const createTrackPowerUps = (p5: p.P5CanvasInstance): TrackPowerUp[] => {
  const timeBetweenPowerUps = 500;

  const trackPowerUps = audioFiles.map(
    ({ title, artist, audioSrc, tint }, index) => {
      const powerUp = new TrackPowerUp({
        p5,
        src: cdImage,
        title,
        artist,
        audioSrc,
        tint,
      });
      setTimeout(() => {
        powerUp.setPositionWithinBounds();
        powerUp.shouldDraw = true;
      }, timeBetweenPowerUps * (index + 1));
      return powerUp;
    }
  );

  return trackPowerUps;
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

const createRectangles = (p5: p.P5CanvasInstance): FallingRectangle[] => {
  const distanceBetweenRectangles = 200;
  const widths = Array.from({ length: 20 }, () => getRandomNumber(0.5, 0.9));

  const rectangles = widths.map((width, index) => {
    if ((index + 1) % 5 === 0) {
      const colours = ['#edf67d', '#f896d8', '#ca7df9', '#724cf9', '#564592'];
      const randomIndex = Math.floor(Math.random() * colours.length);
      const randomColour = colours[randomIndex];
      return new FallingRectangle({
        width: innerWidth,
        height: 80,
        colour: randomColour,
        p5: p5,
        innerHeight,
        yOffset: distanceBetweenRectangles * index,
        stroke: null,
      });
    }
    return new FallingRectangle({
      width: innerWidth * width,
      height: 20,
      colour: 'black',
      p5: p5,
      innerHeight,
      yOffset: distanceBetweenRectangles * index,
    });
  });

  return rectangles;
};

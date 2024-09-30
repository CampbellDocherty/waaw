import * as p from '@p5-wrapper/react';
import lastKissAudioSrc from '../audio/last-kiss.mp3';
import sativaAudioSrc from '../audio/sativa.mp3';
import loveAudioSrc from '../audio/love.mp3';
import monoRegular from '../fonts/Mono-Regular.ttf';
import cdImage from '../images/cd.png';
import folder from '../images/folder.png';
import theTwins from '../images/the-twins.jpg';
import { Font } from './Font';
import { ColourPowerUp, SpeedPowerUp, TrackPowerUp } from './PowerUp';
import { Star } from './Star';

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
  let mainImage: any;
  let cd: any;

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

  const instructionsButton = p5.select('.instructions');
  const gameScreen = p5.select('.game-screen');
  const socialScreen = p5.select('.social-screen');
  const folderButton = p5.select('.folder-button');
  const tracksText = p5.select('.tracks');
  const menuButton = p5.select('.top-left');
  const gameButton = p5.select('.top-right');

  let trackContainer: any;
  let selectedTrack: TrackPowerUp | null = null;

  let isFolderOpen = false;
  let screen: Screen = Screen.INITIAL;

  p5.setup = () => {
    p5.createCanvas(innerWidth * 2, innerHeight, p5.WEBGL);
    p5.textFont(font.font);

    menuButton.mousePressed(() => {
      screen = Screen.SOCIALS;
    });

    gameButton.mousePressed(() => {
      screen = Screen.GAME;
    });

    folderButton.style('background-image', `url(${folder})`);
    folderButton.position(
      innerWidth / 2 - folderButton.width / 2,
      innerHeight / 2 - folderButton.height / 2 + 100
    );
    folderButton.mousePressed(() => {
      if (isFolderOpen) {
        trackContainer.hide();
      }
      isFolderOpen = !isFolderOpen;
    });

    trackContainer = p5.select('.track-container');
    trackContainer.position(
      innerWidth / 2 - trackContainer.size().width / 2,
      innerHeight / 2 - trackContainer.size().height / 2 - 60
    );
    trackContainer.hide();

    const trackContainerTitle = p5.createDiv('Tracks');
    trackContainerTitle.addClass('track-container-title');
    trackContainer.child(trackContainerTitle);

    const tracksSection = p5.createDiv();
    tracksSection.addClass('tracks-section');
    for (const track of trackPowerUps) {
      track.createAudio();
      track.createButton();
      tracksSection.child(track.button);
      track.button.mousePressed(() => {
        selectedTrack = track;
        track.audio.stop();
        track.audio.time = 0;
        track.audio.play();
        trackContainer.hide();
        isFolderOpen = false;
      });
      track.button.touchStarted(() => {
        selectedTrack = track;
        track.audio.stop();
        track.audio.time = 0;
        track.audio.play();
        trackContainer.hide();
        isFolderOpen = false;
      });
    }

    trackContainer.child(tracksSection);

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
    if (isProbablyWeb) {
      if (instructionsButton) {
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

  let startingX = 0;

  p5.draw = () => {
    p5.background(102);

    // key presses for web
    if (isProbablyWeb) {
      _drawByKeyPress(pressedKeys, star);
    }

    // draw star
    p5.image(mainImage, 0, -120, 140, 170);
    const starVertices = star.draw(p5, !start);

    if (!start) return;

    const hiddenElements = p5.selectAll('.hidden');
    for (const hidden of hiddenElements) {
      hidden.removeClass('hidden');
      hidden.addClass('show');
    }

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

    if (isFolderOpen) {
      trackContainer.show();
    }

    // check for colour powerup collisions
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

    // check for speed powerup collisions
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

    if (selectedTrack) {
      p5.push();

      // draw image
      p5.imageMode(p5.CENTER);
      const xCenterOfDisk = -p5.width / 4 + 30;
      const yCenterOfDisk = -p5.height / 2 + 30;
      p5.image(cd, xCenterOfDisk, yCenterOfDisk, 30, 30);

      // draw song title
      p5.fill('white');
      p5.textSize(12);
      p5.text(selectedTrack.title, xCenterOfDisk + 20, yCenterOfDisk - 4);

      // draw song artist
      p5.textSize(10);
      p5.text(selectedTrack.artist, xCenterOfDisk + 20, yCenterOfDisk + 10);

      p5.pop();
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

const createTrackPowerUps = (p5: p.P5CanvasInstance): TrackPowerUp[] => {
  const timeBetweenPowerUps = 500;
  const tracks = [
    {
      title: 'Last Kiss',
      artist: 'James Massiah',
      audioSrc: lastKissAudioSrc,
    },
    {
      title: 'Sativa (Waaw blend)',
      artist: 'Jhene Aiko x Waaw',
      audioSrc: sativaAudioSrc,
    },
    {
      title: 'Loveeeeeee Song (Waaw blend)',
      artist: 'Rihanna feat. Future x Waaw',
      audioSrc: loveAudioSrc,
    },
  ];
  const trackPowerUps = tracks.map(({ title, artist, audioSrc }, index) => {
    const powerUp = new TrackPowerUp(p5, cdImage, title, artist, audioSrc);
    setTimeout(() => {
      powerUp.setPositionWithinBounds();
      powerUp.shouldDraw = true;
    }, timeBetweenPowerUps * (index + 1));
    return powerUp;
  });

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

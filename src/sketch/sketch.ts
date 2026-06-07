import p5Type from 'p5';
import monoRegular from '../fonts/Mono-Regular.ttf';
import { EvilStar } from '../functions/EvilStar';
import { TrackPowerUp } from '../functions/PowerUp';
import { Star } from '../functions/Star';
import cdImage from '../images/cd.png';
import folder from '../images/folder.png';
import { createEvilPowerUps } from './createEvilPowerUps';
import { createFallingRectangles } from './createFallingRectangles';
import { createTrackPowerUps } from './createTrackPowerUps';
import { FinalMix } from '../functions/FinalMix';
import { GameUser, saveUser } from '../gameUsers';
import { LEADERBOARD_REFRESH_EVENT } from '../leaderboard';
import { Portfolio } from '../portfolio';
import type { DeviceMotionPermissionResult } from '../functions/requestDeviceMotionPermission';

enum Screen {
  INITIAL = 'initial',
  GAME = 'game',
  ABOUT = 'about',
}

const DESKTOP_BREAKPOINT = 1024;
const MAX_SCORE = 35000;
const EVIL_STAR_START_SCORE = 19000;
const DEFAULT_PLAYER_COLOUR = '#F875FC';
const HUD_X_INSET = 16;
const HUD_Y_INSET = 30;

type StarPrefs = {
  id: string;
  name: string;
  spikes: number;
  spikeLength: number;
  colour: string;
};

function isDesktop(): boolean {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function getTextSize(desktopSize: number, mobileSize: number): number {
  return isDesktop() ? desktopSize : mobileSize;
}

function getSavedStarColour(): string {
  const starPrefs = localStorage.getItem('starPrefs');
  if (!starPrefs) {
    return DEFAULT_PLAYER_COLOUR;
  }

  try {
    const prefs = JSON.parse(starPrefs) as Partial<StarPrefs>;
    return prefs.colour ?? DEFAULT_PLAYER_COLOUR;
  } catch {
    return DEFAULT_PLAYER_COLOUR;
  }
}

export const sketch = (
  p5: p5Type,
  star: Star,
  onStart: () => Promise<DeviceMotionPermissionResult>,
  isProbablyWeb: boolean,
  portfolio: Portfolio
): void => {
  let start = false;
  let allPowerUpsCollected = false;
  let mainImage: p5Type.Image;
  let finalMix: FinalMix;

  let startingX = 0;
  let score = 0;
  let diedInGame = false;
  let hasCompleted = false;
  let hasWonGame = false;
  let hasSubmittedUserResult = false;
  let imageOpacity = 255;

  const pressedKeys: { [key: string]: boolean } = {};

  let font: p5Type.Font;
  let trackPowerUps: TrackPowerUp[];

  p5.preload = () => {
    font = p5.loadFont(monoRegular);
    star.bindToP5Instance(p5);
    finalMix = new FinalMix(cdImage, portfolio.secretMix, p5);
    mainImage = p5.loadImage(portfolio.image);
    trackPowerUps = createTrackPowerUps(
      p5,
      hasReachedCheckpoint,
      portfolio.songs
    );
  };

  const hasReachedCheckpoint = Boolean(localStorage.getItem('checkpoint'));

  const rectangles = createFallingRectangles(p5);
  const evilPowerUps = createEvilPowerUps(p5);
  const evilStar = new EvilStar(0, -innerHeight / 2 - 100, p5, evilPowerUps);

  const instructionsButton = p5.select('.instructions');
  const gameScreen = p5.select('.game-screen');
  const gameOverScreen = p5.select('.game-over-screen');
  const tracksText = p5.select('.tracks');
  const socialsButton = p5.select('.bottom-left');
  const aboutButton = p5.select('#about-btn');
  const backFromAboutButton = p5.select('#back-from-about-btn');
  const folderButton = p5.select('.folder-button');
  const gameButton = p5.select('.bottom-right');
  const trackContainer = p5.select('.track-container');
  const tracksSection = p5.select('.tracks-section');
  const trackContainerClose = p5.select('.track-container-close');
  const playAgainButton = p5.select('.play-again-button');
  const finalScore = p5.select('.final-score');
  const aboutScreen = p5.select(
    '.panel-game > .about-screen:not(.motion-denied-screen)'
  );
  const motionDeniedScreen = p5.select('.motion-denied-screen');
  const motionDeniedRetryButton = p5.select('.motion-denied-retry');

  let selectedTrack: TrackPowerUp | null = null;
  let screen: Screen = Screen.INITIAL;
  let building = false;
  let showingMotionDeniedScreen = false;

  const savedPrefs = localStorage.getItem('starPrefs');
  if (savedPrefs) {
    const prefs = JSON.parse(savedPrefs);
    star.updateSpikeCount(prefs.spikes);
    star.updateSpikeLength(prefs.spikeLength);
    star.updateColour(prefs.colour);
  }

  p5.setup = () => {
    const gamePanel = document.querySelector('.panel-game');
    const canvasWidth = isDesktop()
      ? gamePanel?.clientWidth ?? innerWidth
      : innerWidth * 2;
    const canvasHeight = isDesktop()
      ? gamePanel?.clientHeight ?? innerHeight
      : innerHeight;
    p5.createCanvas(canvasWidth, canvasHeight, p5.WEBGL);
    p5.textFont(font);

    socialsButton?.mousePressed(() => {
      screen = Screen.ABOUT;
    });

    gameButton?.mousePressed(() => {
      screen = Screen.GAME;
    });

    aboutButton?.mousePressed(() => {
      screen = Screen.ABOUT;
    });

    backFromAboutButton?.mousePressed(() => {
      screen = Screen.GAME;
    });

    playAgainButton?.mousePressed(() => {
      selectedTrack = null;
      rectangles.forEach((rectangle) => rectangle.reset());
      gameOverScreen?.removeClass('show');
      gameOverScreen?.addClass('hide');
      gameOverScreen?.style('display', 'none');
      diedInGame = false;
      hasWonGame = false;
      hasCompleted = false;
      finalMix.hasBeenCollected = false;
      finalMix.downloadTriggered = false;
      finalMix.shouldDraw = true;
      hasSubmittedUserResult = false;
      evilStar.reset();
      score = 0;
      instructionsButton?.removeClass('hide');
      instructionsButton?.addClass('show');
      folderButton?.removeClass('hide');
      folderButton?.addClass('show');
      tracksText?.removeClass('hide');
      tracksText?.addClass('show');
      socialsButton?.removeClass('hide');
      socialsButton?.addClass('show');
      aboutButton?.removeClass('hide');
      aboutButton?.addClass('show');
      localStorage.setItem('checkpoint', 'true');
    });

    folderButton?.style('background-image', `url(${folder})`);
    folderButton?.mousePressed(() => {
      if (trackContainer?.style('display') !== 'none') {
        trackContainer?.hide();
      } else {
        trackContainer.show();
      }
    });

    trackContainerClose?.mousePressed(() => {
      trackContainer?.hide();
    });
    trackContainerClose?.touchEnded(() => {
      trackContainer?.hide();
    });
    trackContainer?.position(40, 40);

    for (const track of trackPowerUps) {
      tracksSection?.child(track.button);
      const onTrackSelect = () => {
        trackPowerUps.forEach((track) => track.audio?.stop());
        selectedTrack = track;
        if (track.audio) {
          track.audio.stop();
          track.audio.time(0);
          track.audio.play();
        }
        if (allPowerUpsCollected) {
          rectangles.forEach((rectangle) => {
            rectangle.shouldDraw = true;
            rectangle.shouldAnimate = true;
          });
        }
        trackContainer?.hide();
        instructionsButton?.removeClass('show');
        instructionsButton?.addClass('hide');
      };
      track.button?.mousePressed(onTrackSelect);

      let touchStartY = 0;
      track.button?.elt.addEventListener(
        'touchstart',
        (e: TouchEvent) => {
          touchStartY = e.touches[0].clientY;
        },
        { passive: true }
      );
      track.button?.elt.addEventListener('touchend', (e: TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        if (Math.abs(touchEndY - touchStartY) < 10) {
          onTrackSelect();
        }
      });

      if (hasReachedCheckpoint) {
        track.remove();
        track.showButton();
      }
    }

    const button = p5.createButton(
      isProbablyWeb ? 'Click to start!' : 'Press to start!'
    );
    button.addClass('start-button');
    positionStartButton(button);
    const starBuilder = document.querySelector(
      '.star-builder'
    ) as HTMLElement | null;
    const showMotionDeniedScreen = () => {
      showingMotionDeniedScreen = true;
      motionDeniedScreen?.removeClass('hide-about');
      motionDeniedScreen?.addClass('show-about');
    };
    const hideMotionDeniedScreen = () => {
      if (!motionDeniedScreen?.elt.classList.contains('show-about')) {
        return;
      }

      showingMotionDeniedScreen = false;
      motionDeniedScreen?.removeClass('show-about');
      motionDeniedScreen?.addClass('hide-about');
    };
    const continueStartFlow = (forceBuilder = false) => {
      hideMotionDeniedScreen();

      if (savedPrefs && !forceBuilder) {
        start = true;
        star.xPos = 0;
        star.yPos = -120;
        setTimeout(() => {
          instructionsButton?.removeClass('show');
          instructionsButton?.addClass('hide');
        }, 4000);
      } else {
        building = true;
        if (starBuilder) {
          starBuilder.style.display = 'flex';
        }
      }
    };
    const handleStart = async () => {
      const permissionResult = await onStart();
      button.hide();

      if (permissionResult === 'denied') {
        showMotionDeniedScreen();
        return;
      }

      continueStartFlow();
    };
    const handleMotionDeniedRetry = async () => {
      const permissionResult = await onStart();

      if (permissionResult === 'denied') {
        return;
      }

      continueStartFlow(true);
    };
    button.mousePressed(handleStart);
    button.touchEnded(handleStart);
    motionDeniedRetryButton?.elt.addEventListener(
      'click',
      handleMotionDeniedRetry
    );

    if (starBuilder) {
      const optionButtons = starBuilder.querySelectorAll(
        '.star-builder-options button'
      );
      optionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const group = btn.parentElement?.getAttribute('data-group');
          btn.parentElement
            ?.querySelectorAll('button')
            .forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');

          const value = btn.getAttribute('data-value');
          if (!value) return;

          if (group === 'spikes') {
            star.updateSpikeCount(parseInt(value));
          } else if (group === 'length') {
            star.updateSpikeLength(parseInt(value));
          } else if (group === 'colour') {
            star.updateColour(value);
          }
        });
      });

      const startGameBtn = starBuilder.querySelector('.star-builder-start');
      const nameInput = starBuilder.querySelector(
        '.star-builder-name'
      ) as HTMLInputElement | null;
      nameInput?.addEventListener('input', () => {
        nameInput.setCustomValidity('');
      });
      startGameBtn?.addEventListener('click', () => {
        const playerName = nameInput?.value.trim() ?? '';
        if (!playerName) {
          nameInput?.setCustomValidity('Enter a name to start');
          nameInput?.reportValidity();
          nameInput?.focus();
          return;
        }

        building = false;
        start = true;
        (starBuilder as HTMLElement).style.display = 'none';

        star.xPos = 0;
        star.yPos = -120;

        const prefs: StarPrefs = {
          id: crypto.randomUUID(),
          name: playerName,
          spikes: star.npoints,
          spikeLength: star.closeRadius,
          colour: star.colour,
        };
        localStorage.setItem('starPrefs', JSON.stringify(prefs));
        void saveUser(getUserInputFromPrefs(prefs, 0)).catch(() => undefined);

        setTimeout(() => {
          instructionsButton?.removeClass('show');
          instructionsButton?.addClass('hide');
        }, 4000);
      });
    }

    p5.imageMode(p5.CENTER);
  };

  p5.draw = () => {
    const isPlayingTheGame = allPowerUpsCollected && selectedTrack;
    p5.background('#90908e');
    if (isProbablyWeb) {
      _drawByKeyPress(pressedKeys, star);
    }

    if (showingMotionDeniedScreen) {
      return;
    }

    if (!isDesktop() && !start) {
      if (building) {
        imageOpacity = Math.max(0, imageOpacity - 8);
      }
      if (imageOpacity > 0) {
        p5.push();
        p5.tint(255, imageOpacity);
        p5.image(mainImage, 0, -120, 140, 170);
        p5.pop();
      }
    }

    if (building) {
      star.draw(p5, true);
      return;
    }

    if (!start) {
      star.draw(p5, true);
      return;
    }

    const hiddenElements = p5.selectAll('.hidden');
    for (const hidden of hiddenElements) {
      hidden.removeClass('hidden');
      hidden.addClass('show');
    }

    if (folderButton) {
      const folderX = isDesktop()
        ? p5.width / 2 - folderButton.width / 2
        : p5.width / 4 - folderButton.width / 2;
      folderButton.position(
        folderX,
        p5.height / 2 - folderButton.height / 2 + 100
      );
    }

    if (!isDesktop()) {
      if (screen === Screen.ABOUT) {
        let x = (startingX -= 50);
        if (x <= -p5.width / 2) {
          startingX = -p5.width / 2;
          x = -p5.width / 2;
        }
        p5.translate(x, 0);

        if (!aboutScreen?.elt.classList.contains('show-about')) {
          aboutScreen?.removeClass('hide-about');
          aboutScreen?.addClass('show-about');
        }

        if (!gameScreen?.elt.classList.contains('slide-out-left')) {
          gameScreen?.removeClass('slide-in-left');
          gameScreen?.removeClass('slide-out-right');
          gameScreen?.removeClass('slide-in-from-left');
          gameScreen?.addClass('slide-out-left');
        }
      }

      if (screen === Screen.GAME) {
        if (startingX < 0) {
          let x = (startingX += 50);
          if (x >= 0) {
            startingX = 0;
            x = 0;
          }
          p5.translate(x, 0);

          if (!aboutScreen?.elt.classList.contains('hide-about')) {
            aboutScreen?.removeClass('show-about');
            aboutScreen?.addClass('hide-about');
          }

          if (!gameScreen?.elt.classList.contains('slide-in-from-left')) {
            gameScreen?.removeClass('slide-out-left');
            gameScreen?.removeClass('slide-out-right');
            gameScreen?.removeClass('slide-in-left');
            gameScreen?.addClass('slide-in-from-left');
          }
        }
      }
    }

    const starVertices = star.draw(p5, true);

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

    const tracksX = isDesktop()
      ? p5.width / 2 - (folderButton?.width ?? 0) / 2
      : p5.width / 4 - (folderButton?.width ?? 0) / 2;
    tracksText?.position(
      tracksX,
      p5.height / 2 - (folderButton?.height ?? 0) / 2 + 170
    );
    tracksText?.html(`Tracks (${collectedTracks.length})`);

    if (isPlayingTheGame) {
      folderButton?.removeClass('show');
      folderButton?.addClass('hide');
      tracksText?.removeClass('show');
      tracksText?.addClass('hide');
      socialsButton?.removeClass('show');
      socialsButton?.addClass('hide');
      aboutButton?.removeClass('show');
      aboutButton?.addClass('hide');

      const hasEndedGame = diedInGame || hasWonGame;

      p5.push();
      p5.noStroke();
      p5.fill('white');
      p5.textAlign(p5.RIGHT);
      p5.textSize(getTextSize(14, 12));
      const scoreX = isDesktop()
        ? p5.width / 2 - HUD_X_INSET
        : innerWidth / 2 - HUD_X_INSET;
      const scoreY = -p5.height / 2 + HUD_Y_INSET;
      p5.text('Score', scoreX, scoreY);
      p5.textSize(getTextSize(18, 15));
      if (!hasEndedGame) {
        score = Math.min(score + 10, MAX_SCORE);
      }
      p5.text(score, scoreX, scoreY + 17);
      p5.pop();

      for (const rectangle of rectangles) {
        if (!hasEndedGame) {
          rectangle.shouldDraw = true;
          rectangle.shouldAnimate = true;
        }

        rectangle.draw();

        const isColliding = starVertices.some((vertex) => {
          const { x, y } = vertex;
          return rectangle.checkIfColliding(x, y);
        });

        if (isColliding) {
          diedInGame = true;
        }
      }

      if (score > EVIL_STAR_START_SCORE) {
        evilPowerUps.forEach((powerUp) => {
          powerUp.draw();
          const isColliding = starVertices.some((vertex) => {
            const { x, y } = vertex;
            return powerUp.checkIfColliding(x, y);
          });

          if (isColliding) {
            diedInGame = true;
          }
        });
        evilStar.draw();
        if (score >= MAX_SCORE) {
          score = MAX_SCORE;
          hasCompleted = true;
          evilStar.retreat();
        }
      }
      if (hasCompleted) {
        finalMix.draw();
        const isCollidingWithFinalMix = starVertices.some((vertex) => {
          const { x, y } = vertex;
          return finalMix.checkIfColliding(x, y);
        });

        if (isCollidingWithFinalMix) {
          finalMix.hasBeenCollected = true;
        }
        if (finalMix.hasBeenCollected && !finalMix.downloadTriggered) {
          localStorage.setItem('hasCompleted', 'true');
          hasWonGame = true;
          submitUserResult(score);
          downloadFinalMix();
          finalMix.downloadTriggered = true;
        }
      }
    }

    if (diedInGame || hasWonGame) {
      showEndScreen();
    }

    const allPowerUps = [...trackPowerUps];
    const allCollectedPowerUps = [...collectedTracks];
    if (
      allCollectedPowerUps.length === allPowerUps.length &&
      !allPowerUpsCollected
    ) {
      allPowerUpsCollected = true;
    }

    if (allPowerUpsCollected && !selectedTrack) {
      instructionsButton?.html('Select a track to play');
      instructionsButton?.removeClass('hide');
      instructionsButton?.addClass('show');
    }

    if (selectedTrack) {
      drawTrackDetails(selectedTrack);
    }

    // update star position
    if (
      !diedInGame &&
      !hasWonGame &&
      (screen === Screen.GAME || screen === Screen.INITIAL)
    ) {
      star.updatePosition(p5.deltaTime);
    }
  };

  function drawTrackDetails(track: TrackPowerUp) {
    p5.push();

    p5.fill('white');
    p5.textAlign(p5.LEFT);
    p5.textSize(getTextSize(16, 13));
    const trackTextX = isDesktop()
      ? -p5.width / 2 + HUD_X_INSET
      : -p5.width / 4 + HUD_X_INSET;
    const scoreY = -p5.height / 2 + HUD_Y_INSET;
    p5.text(track.title, trackTextX, scoreY);

    p5.textSize(getTextSize(12, 10));
    p5.text(track.artist, trackTextX, scoreY + 15);

    drawTrackProgress(track, trackTextX, scoreY + 24);

    p5.pop();
  }

  function drawTrackProgress(track: TrackPowerUp, x: number, y: number) {
    const duration = track.audio.duration();
    const currentTime = track.audio.time();
    const progress =
      duration > 0 && Number.isFinite(duration)
        ? p5.constrain(currentTime / duration, 0, 1)
        : 0;
    const width = isDesktop() ? 180 : Math.min(140, innerWidth * 0.34);
    const height = 3;

    p5.push();
    p5.rectMode(p5.CORNER);
    p5.noStroke();
    p5.fill(255, 255, 255, 55);
    p5.rect(x, y, width, height);
    p5.fill(getSavedStarColour());
    p5.rect(x, y, width * progress, height);
    p5.pop();
  }

  function showEndScreen() {
    submitUserResult(score);
    rectangles.forEach((rectangle) => (rectangle.shouldAnimate = false));
    finalScore?.html(score.toString());
    gameOverScreen?.removeClass('hide');
    gameOverScreen?.style('display', 'flex');
    gameOverScreen?.addClass('show');
    selectedTrack?.audio?.stop();
    evilPowerUps.forEach((powerUp) => (powerUp.shouldAnimate = false));
    evilStar.shouldAnimate = false;
  }

  p5.keyPressed = (event: { key: string }) => {
    if (!start) return;
    if (isProbablyWeb) {
      pressedKeys[event.key] = true;
    }
  };

  p5.keyReleased = (event: { key: string }) => {
    if (isProbablyWeb) {
      pressedKeys[event.key] = false;
    }
  };

  p5.windowResized = () => {
    const gamePanel = document.querySelector('.panel-game');
    const w = isDesktop()
      ? gamePanel?.clientWidth ?? innerWidth
      : innerWidth * 2;
    const h = isDesktop()
      ? gamePanel?.clientHeight ?? innerHeight
      : innerHeight;
    p5.resizeCanvas(w, h);
    startingX = 0;
    star.reset();
    const startButton = p5.select('.start-button');
    if (startButton) {
      positionStartButton(startButton);
    }
  };

  function positionStartButton(button: p5Type.Element) {
    const buttonWidth = p5.width;
    const buttonHeight = p5.height * 2;
    button.style('width', `${buttonWidth}px`);
    button.style('height', `${buttonHeight}px`);
    const startBtnX = isDesktop()
      ? p5.width / 2 - buttonWidth / 2
      : p5.width / 4 - buttonWidth / 2;
    button.position(startBtnX, p5.height / 2 - buttonHeight / 2);
  }

  function downloadFinalMix() {
    const downloadLink = p5.createA(finalMix.finalMixSrc, '');
    downloadLink.attribute('download', 'waaw-secret-mix.mp3');
    downloadLink.elt.addEventListener('click', function () {
      finalMix.remove();
    });
    downloadLink.elt.click();
  }

  function getUserInput(finalScore: number): GameUser | null {
    const starPrefs = localStorage.getItem('starPrefs');
    if (!starPrefs) {
      return null;
    }

    try {
      const prefs = JSON.parse(starPrefs) as StarPrefs;
      return getUserInputFromPrefs(prefs, finalScore);
    } catch {
      return null;
    }
  }

  function getUserInputFromPrefs(
    prefs: StarPrefs,
    finalScore: number
  ): GameUser {
    return {
      id: prefs.id,
      name: prefs.name,
      length: prefs.spikeLength,
      colour: prefs.colour,
      score: finalScore,
      points: prefs.spikes,
    };
  }

  function submitUserResult(finalScore: number): void {
    if (hasSubmittedUserResult) {
      return;
    }

    const user = getUserInput(finalScore);
    if (!user) {
      return;
    }

    hasSubmittedUserResult = true;
    void saveUser(user)
      .then(() => window.dispatchEvent(new Event(LEADERBOARD_REFRESH_EVENT)))
      .catch(() => undefined);
  }
};

const _drawByKeyPress = (
  pressedKeys: { [key: string]: boolean },
  star: Star
) => {
  if (pressedKeys['ArrowLeft']) {
    star.updateVelocity(-20, 0);
  }
  if (pressedKeys['ArrowRight']) {
    star.updateVelocity(20, 0);
  }
  if (pressedKeys['ArrowUp']) {
    star.updateVelocity(0, -20);
  }
  if (pressedKeys['ArrowDown']) {
    star.updateVelocity(0, 20);
  }

  if (!Object.values(pressedKeys).some((value) => value)) {
    star.updateVelocity(0, 0);
  }
};

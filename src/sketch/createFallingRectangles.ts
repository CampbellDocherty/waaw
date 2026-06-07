import p5Type from 'p5';
import { FallingRectangle } from '../functions/Rectangle';
import { getRandomNumber } from '../functions/getRandomNumber';
import { STAR_WIDTH } from '../functions/Star';

const DESKTOP_BREAKPOINT = 1024;
const MOBILE_PASSAGE_WIDTH = STAR_WIDTH + 24;

function getGameWidth(): number {
  if (window.innerWidth >= DESKTOP_BREAKPOINT) {
    return document.querySelector('.panel-game')?.clientWidth ?? innerWidth;
  }
  return innerWidth;
}

function isDesktop(): boolean {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function getWidthRatio(lane: number, gameWidth: number): number {
  if (isDesktop()) {
    const width = getRandomNumber(0.5, 0.82);
    return Math.abs(lane) > 0.6 ? getRandomNumber(0.65, 0.9) : width;
  }

  const maxWidth = Math.abs(lane) < 0.2
    ? gameWidth - MOBILE_PASSAGE_WIDTH * 2
    : gameWidth - MOBILE_PASSAGE_WIDTH;
  const maxRatio = Math.max(0.18, maxWidth / gameWidth);
  const minRatio = Math.min(0.5, Math.max(0.12, maxRatio - 0.1));

  return getRandomNumber(minRatio, maxRatio);
}

export const createFallingRectangles = (p5: p5Type): FallingRectangle[] => {
  const distanceBetweenRectangles = 200;
  const gameWidth = getGameWidth();
  const lanes = [-0.75, -0.35, 0, 0.35, 0.75];
  const plannedLanes = Array.from({ length: 4 }, () =>
    [...lanes].sort(() => getRandomNumber(-1, 1))
  ).flat();
  const widths = plannedLanes.map((lane) => getWidthRatio(lane, gameWidth));

  const rectangles = widths.map((widthRatio, index) => {
    const width = gameWidth * widthRatio;
    const lane = plannedLanes[index];
    const getXPosition = () => {
      const maxCenter = Math.max(0, gameWidth / 2 - width / 2);
      if (!isDesktop()) {
        let minX = -maxCenter;
        let maxX = maxCenter;

        if (lane > 0.2) {
          minX = Math.max(minX, MOBILE_PASSAGE_WIDTH - maxCenter);
        } else if (lane < -0.2) {
          maxX = Math.min(maxX, maxCenter - MOBILE_PASSAGE_WIDTH);
        } else {
          minX = Math.max(minX, MOBILE_PASSAGE_WIDTH - maxCenter);
          maxX = Math.min(maxX, maxCenter - MOBILE_PASSAGE_WIDTH);
        }

        if (minX > maxX) {
          return 0;
        }

        return getRandomNumber(minX, maxX);
      }

      const safeMaxCenter = Math.max(0, maxCenter - STAR_WIDTH / 2);
      const jitter = getRandomNumber(-0.12, 0.12) * gameWidth;

      return p5.constrain(
        lane * safeMaxCenter + jitter,
        -safeMaxCenter,
        safeMaxCenter
      );
    };

    return new FallingRectangle({
      width,
      height: 20,
      colour: 'black',
      p5: p5,
      yOffset: distanceBetweenRectangles * index,
      getXPosition,
    });
  });

  return rectangles;
};

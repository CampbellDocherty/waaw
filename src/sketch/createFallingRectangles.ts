import p5Type from 'p5';
import { FallingRectangle } from '../functions/Rectangle';
import { getRandomNumber } from '../functions/getRandomNumber';
import { STAR_WIDTH } from '../functions/Star';

const DESKTOP_BREAKPOINT = 1024;
const PASSAGE_WIDTH = STAR_WIDTH + 72;
const SIDE_LANES = [-0.75, -0.35, 0.35, 0.75];
const MIDDLE_GAP_INTERVAL = 8;
const RECTANGLE_WAVE_COUNT = 32;

type RectanglePlan = number | 'middle';

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
  const maxWidth =
    Math.abs(lane) < 0.2
      ? gameWidth - PASSAGE_WIDTH * 2
      : gameWidth - PASSAGE_WIDTH;
  const maxRatio = Math.max(0.18, maxWidth / gameWidth);
  const minRatio = Math.min(0.5, Math.max(0.12, maxRatio - 0.1));

  return getRandomNumber(minRatio, maxRatio);
}

function getPlannedRectangles(): RectanglePlan[] {
  return Array.from({ length: RECTANGLE_WAVE_COUNT }, (_, index) => {
    if (index % MIDDLE_GAP_INTERVAL === 4) {
      return 'middle';
    }

    return SIDE_LANES[Math.floor(getRandomNumber(0, SIDE_LANES.length))];
  });
}

export const createFallingRectangles = (p5: p5Type): FallingRectangle[] => {
  const distanceBetweenRectangles = 200;
  const gameWidth = getGameWidth();
  const plannedRectangles = getPlannedRectangles();

  const rectangles = plannedRectangles.flatMap((lane, index) => {
    const yOffset = distanceBetweenRectangles * index;

    if (lane === 'middle') {
      const maxGapOffset = Math.max(0, gameWidth / 2 - PASSAGE_WIDTH / 2);
      const gapCenter = getRandomNumber(
        -maxGapOffset * 0.45,
        maxGapOffset * 0.45
      );
      const gapLeft = gapCenter - PASSAGE_WIDTH / 2;
      const gapRight = gapCenter + PASSAGE_WIDTH / 2;
      const leftWidth = gapLeft + gameWidth / 2;
      const rightWidth = gameWidth / 2 - gapRight;

      return [
        new FallingRectangle({
          width: leftWidth,
          height: 20,
          colour: 'black',
          p5: p5,
          yOffset,
          getXPosition: () => -gameWidth / 2 + leftWidth / 2,
        }),
        new FallingRectangle({
          width: rightWidth,
          height: 20,
          colour: 'black',
          p5: p5,
          yOffset,
          getXPosition: () => gameWidth / 2 - rightWidth / 2,
        }),
      ];
    }

    const widthRatio = getWidthRatio(lane, gameWidth);
    const width = gameWidth * widthRatio;
    const getXPosition = () => {
      const maxCenter = Math.max(0, gameWidth / 2 - width / 2);
      let minX = -maxCenter;
      let maxX = maxCenter;

      if (lane > 0.2) {
        minX = Math.max(minX, PASSAGE_WIDTH - maxCenter);
      } else if (lane < -0.2) {
        maxX = Math.min(maxX, maxCenter - PASSAGE_WIDTH);
      }

      if (minX > maxX) {
        return lane > 0 ? maxCenter : -maxCenter;
      }

      if (!isDesktop()) {
        return getRandomNumber(minX, maxX);
      }

      const jitter = getRandomNumber(-0.12, 0.12) * gameWidth;

      return p5.constrain(lane * maxCenter + jitter, minX, maxX);
    };

    return new FallingRectangle({
      width,
      height: 20,
      colour: 'black',
      p5: p5,
      yOffset,
      getXPosition,
    });
  });

  return rectangles;
};

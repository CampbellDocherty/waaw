import p5Type from 'p5';
import { FallingRectangle } from '../functions/Rectangle';
import { getRandomNumber } from '../functions/getRandomNumber';
import { STAR_WIDTH } from '../functions/Star';

const DESKTOP_BREAKPOINT = 1024;
const MIN_PASSAGE_WIDTH = STAR_WIDTH + 96;

function getPassageWidth(gameWidth: number): number {
  return Math.min(
    Math.max(MIN_PASSAGE_WIDTH, gameWidth * 0.34),
    gameWidth * 0.5
  );
}

function getGameWidth(): number {
  if (window.innerWidth >= DESKTOP_BREAKPOINT) {
    return document.querySelector('.panel-game')?.clientWidth ?? innerWidth;
  }
  return innerWidth;
}

function getSideLane(gapSide: 'left' | 'right'): number {
  const laneMagnitude = getRandomNumber(0.35, 0.75);
  return gapSide === 'left' ? laneMagnitude : -laneMagnitude;
}

function getPlannedLanes(): number[] {
  const firstGapSide: 'left' | 'right' =
    getRandomNumber(-1, 1) > 0 ? 'left' : 'right';
  const secondGapSide = firstGapSide === 'left' ? 'right' : 'left';
  const pattern: Array<'left' | 'right' | 'middle'> = [
    firstGapSide,
    firstGapSide,
    'middle',
    secondGapSide,
    secondGapSide,
    'middle',
  ];

  return Array.from({ length: 20 }, (_, index) => {
    const gap = pattern[index % pattern.length];
    if (gap === 'middle') {
      return 0;
    }

    return getSideLane(gap);
  });
}

export const createFallingRectangles = (p5: p5Type): FallingRectangle[] => {
  const distanceBetweenRectangles = 240;
  const gameWidth = getGameWidth();
  const plannedLanes = getPlannedLanes();

  const rectangles = plannedLanes.flatMap((lane, index) => {
    const yOffset = distanceBetweenRectangles * index;
    const passageWidth = getPassageWidth(gameWidth);

    if (Math.abs(lane) < 0.2) {
      const gapWidth = passageWidth;
      const width = (gameWidth - gapWidth) / 2;

      return [
        new FallingRectangle({
          width,
          height: 20,
          colour: 'black',
          p5: p5,
          yOffset,
          getXPosition: () => -gameWidth / 2 + width / 2,
        }),
        new FallingRectangle({
          width,
          height: 20,
          colour: 'black',
          p5: p5,
          yOffset,
          getXPosition: () => gameWidth / 2 - width / 2,
        }),
      ];
    }

    const width = gameWidth - passageWidth;
    const isBlockingLeftSide = lane < 0;
    const getXPosition = () => {
      return isBlockingLeftSide
        ? -gameWidth / 2 + width / 2
        : gameWidth / 2 - width / 2;
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

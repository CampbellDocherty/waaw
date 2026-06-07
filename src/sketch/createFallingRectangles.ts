import p5Type from 'p5';
import { FallingRectangle } from '../functions/Rectangle';
import { getRandomNumber } from '../functions/getRandomNumber';
import { STAR_WIDTH } from '../functions/Star';

function getGameWidth(): number {
  if (window.innerWidth >= 1024) {
    return document.querySelector('.panel-game')?.clientWidth ?? innerWidth;
  }
  return innerWidth;
}

export const createFallingRectangles = (p5: p5Type): FallingRectangle[] => {
  const distanceBetweenRectangles = 200;
  const gameWidth = getGameWidth();
  const lanes = [-0.75, -0.35, 0, 0.35, 0.75];
  const plannedLanes = Array.from({ length: 4 }, () =>
    [...lanes].sort(() => getRandomNumber(-1, 1))
  ).flat();
  const widths = plannedLanes.map((lane) => {
    const width = getRandomNumber(0.5, 0.82);
    return Math.abs(lane) > 0.6 ? getRandomNumber(0.65, 0.9) : width;
  });

  const rectangles = widths.map((widthRatio, index) => {
    const width = gameWidth * widthRatio;
    const lane = plannedLanes[index];
    const getXPosition = () => {
      const maxCenter = Math.max(0, gameWidth / 2 - width / 2);
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

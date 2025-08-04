import p5Type from 'p5';
import { FallingRectangle } from '../functions/Rectangle';
import { getRandomNumber } from '../functions/getRandomNumber';

export const createFallingRectangles = (p5: p5Type): FallingRectangle[] => {
  const distanceBetweenRectangles = 200;
  const widths = Array.from({ length: 20 }, () => getRandomNumber(0.5, 0.9));
  const rectangles = widths.map((width, index) => {
    return new FallingRectangle({
      width: innerWidth * width,
      p5: p5,
      yOffset: distanceBetweenRectangles * index,
    });
  });

  return rectangles;
};

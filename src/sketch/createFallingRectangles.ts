import p5Type from 'p5';
import { FallingRectangle } from '../functions/Rectangle';
import { getRandomNumber } from '../functions/getRandomNumber';

function getGameWidth(): number {
  if (window.innerWidth >= 1024) {
    return document.querySelector('.panel-game')?.clientWidth ?? innerWidth;
  }
  return innerWidth;
}

export const createFallingRectangles = (p5: p5Type): FallingRectangle[] => {
  const distanceBetweenRectangles = 200;
  const gameWidth = getGameWidth();
  const widths = Array.from({ length: 20 }, () => getRandomNumber(0.5, 0.9));

  const rectangles = widths.map((width, index) => {
    return new FallingRectangle({
      width: gameWidth * width,
      height: 20,
      colour: 'black',
      p5: p5,
      yOffset: distanceBetweenRectangles * index,
    });
  });

  return rectangles;
};

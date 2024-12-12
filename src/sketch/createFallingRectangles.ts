import p5Type from 'p5';
import { FallingRectangle } from '../functions/Rectangle';
import { getRandomNumber } from '../functions/getRandomNumber';

export const createFallingRectangles = (p5: p5Type): FallingRectangle[] => {
  const distanceBetweenRectangles = 200;
  const widths = Array.from({ length: 20 }, () => getRandomNumber(0.5, 0.9));

  const colours = ['#edf67d', '#f896d8', '#ca7df9', '#724cf9', '#564592'];
  const rectangles = widths.map((width, index) => {
    if ((index + 1) % 5 === 0) {
      const randomIndex = Math.floor(Math.random() * colours.length);
      const randomColour = colours[randomIndex];
      colours.splice(randomIndex, 1);
      return new FallingRectangle({
        width: innerWidth,
        height: 80,
        colour: randomColour,
        p5: p5,
        yOffset: distanceBetweenRectangles * index,
        stroke: null,
      });
    }
    return new FallingRectangle({
      width: innerWidth * width,
      height: 20,
      colour: 'black',
      p5: p5,
      yOffset: distanceBetweenRectangles * index,
    });
  });

  return rectangles;
};

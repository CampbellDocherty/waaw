import { ColourPowerUp } from '../functions/PowerUp';
import p5Type from 'p5';

export const createColourPowerUps = (
  p5: p5Type,
  hasReachedCheckpoint: boolean
): ColourPowerUp[] => {
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
    if (!hasReachedCheckpoint) {
      setTimeout(() => {
        powerUp.setPositionWithinBounds();
        powerUp.shouldDraw = true;
      }, timeBetweenPowerUps * (index + 1));
    }
    return powerUp;
  });

  return colourPowerUps;
};

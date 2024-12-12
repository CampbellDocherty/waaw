import { EvilPowerUp } from '../functions/EvilStar';
import p5Type from 'p5';

export const createEvilPowerUps = (p5: p5Type): EvilPowerUp[] => {
  const timeBetweenEachPowerUp = 60;
  const evilPowerUps = Array.from({ length: 10 }, (_, index) => {
    return new EvilPowerUp(0, 0, p5, timeBetweenEachPowerUp * index);
  });

  return evilPowerUps;
};

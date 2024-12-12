import { SpeedPowerUp } from '../functions/PowerUp';
import p5Type from 'p5';

export const createSpeedPowerUps = (p5: p5Type): SpeedPowerUp[] => {
  const timeBetweenPowerUps = 2000;
  const speeds: number[] = [1, 0.25];

  const speedPowerUps = speeds.map((speed, index) => {
    const powerUp = new SpeedPowerUp('#b2f602', speed, 0, 0, p5);
    setTimeout(() => {
      powerUp.setPositionWithinBounds();
      powerUp.shouldDraw = true;
    }, timeBetweenPowerUps * (index + 1));
    return powerUp;
  });

  return speedPowerUps;
};

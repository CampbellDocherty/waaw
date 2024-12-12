import { audioFiles } from '../audio/audio';
import { TrackPowerUp } from '../functions/PowerUp';
import cdImage from '../images/cd.png';
import p5Type from 'p5';

export const createTrackPowerUps = (
  p5: p5Type,
  hasReachedCheckpoint: boolean
): TrackPowerUp[] => {
  const timeBetweenPowerUps = 500;

  const trackPowerUps = audioFiles.map(({ title, artist, audioSrc }, index) => {
    const powerUp = new TrackPowerUp({
      p5,
      src: cdImage,
      title,
      artist,
      audioSrc,
    });
    if (!hasReachedCheckpoint) {
      setTimeout(() => {
        powerUp.setPositionWithinBounds();
        powerUp.shouldDraw = true;
      }, timeBetweenPowerUps * (index + 1));
    }
    return powerUp;
  });

  return trackPowerUps;
};

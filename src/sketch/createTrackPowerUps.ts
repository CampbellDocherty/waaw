import { TrackPowerUp } from '../functions/PowerUp';
import { PortfolioSong } from '../portfolio';
import cdImage from '../images/cd.png';
import p5Type from 'p5';

export const createTrackPowerUps = (
  p5: p5Type,
  hasReachedCheckpoint: boolean,
  songs: PortfolioSong[]
): TrackPowerUp[] => {
  const timeBetweenPowerUps = 500;

  const trackPowerUps = songs.map(({ title, artist, audio }, index) => {
    const powerUp = new TrackPowerUp({
      p5,
      src: cdImage,
      title,
      artist,
      audioSrc: audio,
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

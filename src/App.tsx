import { ReactP5Wrapper } from '@p5-wrapper/react';
import { useEffect, useRef } from 'react';
import { requestDeviceMotionPermission } from './functions/requestDeviceMotionPermission';
import { sketch } from './functions/sketch';
import { Star } from './functions/Star';
import song from './audio/last-kiss.mp3';

const App = () => {
  const star = new Star(0, 0, 0, 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    window.addEventListener('click', async () =>
      requestDeviceMotionPermission(star)
    );

    return () => {
      window.removeEventListener('click', () =>
        requestDeviceMotionPermission(star)
      );
    };
  }, []);

  return (
    <>
      <ReactP5Wrapper sketch={(p5) => sketch(p5, star, audioRef)} />
      <audio controls={false} ref={audioRef}>
        <source src={song} type="audio/mp3" />
        <track kind="captions" src={song} />
        Your browser does not support the audio element.
      </audio>
    </>
  );
};

export default App;

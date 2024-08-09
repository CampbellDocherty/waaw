import { ReactP5Wrapper } from '@p5-wrapper/react';
import { useCallback, useRef } from 'react';
import song from './audio/last-kiss.mp3';
import { requestDeviceMotionPermission } from './functions/requestDeviceMotionPermission';
import { sketch } from './functions/sketch';
import { Star } from './functions/Star';

const App = () => {
  const star = new Star(0, -120, 0, 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const onStart = useCallback(async () => {
    await requestDeviceMotionPermission(star);
  }, []);

  return (
    <>
      <ReactP5Wrapper sketch={(p5) => sketch(p5, star, audioRef, onStart)} />
      <audio controls={false} ref={audioRef}>
        <source src={song} type="audio/mp3" />
        <track kind="captions" src={song} />
        Your browser does not support the audio element.
      </audio>
    </>
  );
};

export default App;

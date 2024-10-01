import { ReactP5Wrapper } from '@p5-wrapper/react';
import { useCallback } from 'react';
import {
  DeviceMotionEventiOS,
  requestDeviceMotionPermission,
} from './functions/requestDeviceMotionPermission';
import { sketch } from './functions/sketch';
import { Star } from './functions/Star';
import { Socials } from './Socials';
import { Game } from './Game';

const App = () => {
  const isProbablyWeb =
    (DeviceMotionEvent as unknown as DeviceMotionEventiOS).requestPermission ===
    undefined;

  const star = new Star(0, -120, 0, 0);

  const onStart = useCallback(async () => {
    await requestDeviceMotionPermission(star);
  }, []);

  return (
    <>
      <Socials />
      <Game isProbablyWeb={isProbablyWeb} />
      <ReactP5Wrapper
        sketch={(p5) => sketch(p5, star, onStart, isProbablyWeb)}
      />
    </>
  );
};

export default App;

import { ReactP5Wrapper } from '@p5-wrapper/react';
import { useEffect } from 'react';
import { requestDeviceMotionPermission } from './functions/requestDeviceMotionPermission';
import { sketch } from './functions/sketch';
import { Star } from './functions/Star';

const App = () => {
  const star = new Star(0, 0, 0, 0);

  useEffect(() => {
    window.addEventListener('click', () => requestDeviceMotionPermission(star));

    return () => {
      window.removeEventListener('click', () =>
        requestDeviceMotionPermission(star)
      );
    };
  }, []);

  return <ReactP5Wrapper sketch={(p5) => sketch(p5, star)} />;
};

export default App;

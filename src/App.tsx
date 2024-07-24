import { ReactP5Wrapper } from '@p5-wrapper/react';
import { useEffect } from 'react';
import { requestDeviceMotionPermission } from './functions/requestDeviceMotionPermission';
import { sketch } from './functions/sketch';
import { Vector } from './functions/Vector';

const App = () => {
  const vector = new Vector(0, 0, 0, 0);

  useEffect(() => {
    window.addEventListener('click', () =>
      requestDeviceMotionPermission(vector)
    );

    return () => {
      window.removeEventListener('click', () =>
        requestDeviceMotionPermission(vector)
      );
    };
  }, []);

  return <ReactP5Wrapper sketch={(p5) => sketch(p5, vector)} />;
};

export default App;

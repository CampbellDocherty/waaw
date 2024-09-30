import { ReactP5Wrapper } from '@p5-wrapper/react';
import Draggable from 'react-draggable';
import { useCallback } from 'react';
import {
  DeviceMotionEventiOS,
  requestDeviceMotionPermission,
} from './functions/requestDeviceMotionPermission';
import { sketch } from './functions/sketch';
import { Star } from './functions/Star';

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
      <Draggable bounds="parent">
        <div className="track-container" style={{ display: 'none' }}></div>
      </Draggable>
      <ReactP5Wrapper
        sketch={(p5) => sketch(p5, star, onStart, isProbablyWeb)}
      />
      <div className="social-screen">
        <button className="top-right">game {'->'}</button>
        <ul>
          <li>
            <a
              href="https://soundcloud.com/waawdj"
              target="_blank"
              rel="noreferrer"
            >
              Soundcloud
            </a>
          </li>
          <li>
            <a
              href="https://www.mixcloud.com/waawtwins/stream/"
              target="_blank"
              rel="noreferrer"
            >
              Mixcloud
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/waawdj/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </li>
        </ul>
      </div>
      <div className="game-screen">
        <button className="top-left hidden">{'<-'} socials</button>
        <p className="instructions hidden">
          {isProbablyWeb
            ? 'Collect the powerups using the arrow keys :)'
            : 'Collect the powerups by tilting your device :)'}
        </p>
        <button className="folder-button hidden" />
        <p className="hidden tracks">Tracks (0)</p>
      </div>
    </>
  );
};

export default App;

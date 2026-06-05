import { ReactP5Wrapper } from '@p5-wrapper/react';
import { useCallback } from 'react';
import {
  DeviceMotionEventiOS,
  requestDeviceMotionPermission,
} from './functions/requestDeviceMotionPermission';
import { sketch } from './sketch/sketch';
import { Star } from './functions/Star';
import { Game } from './Game';
import { GameOver } from './GameOver';
import { About } from './About';
import logoBlack from './images/logo-black.png';
import theTwins from './images/the-twins.jpg';

const App = () => {
  const isProbablyWeb =
    (DeviceMotionEvent as unknown as DeviceMotionEventiOS).requestPermission ===
    undefined;

  const star = new Star(0, -120, 0, 0);

  const onStart = useCallback(async () => {
    await requestDeviceMotionPermission(star);
  }, []);

  return (
    <div className="app-layout">
      <div className="panel panel-title">
        <div className="desktop-title">
          <div className="desktop-title-letters">
            <span>W</span>
            <span>A</span>
            <span>A</span>
            <span>W</span>
          </div>
          <img src={logoBlack} alt="WAAW logo" className="desktop-title-logo" />
        </div>
      </div>
      <div className="panel panel-game">
        <Game isProbablyWeb={isProbablyWeb} />
        <About />
        <GameOver />
        <ReactP5Wrapper
          sketch={(p5) => sketch(p5, star, onStart, isProbablyWeb)}
        />
      </div>
      <div className="panel panel-right">
        <img src={theTwins} alt="WAAW" className="right-image" />
        <About />
        <ul className="right-links">
          <li>
            <a
              href="https://www.instagram.com/waawdj/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </li>
          <li>
            <a href="https://linktr.ee/waaw" target="_blank" rel="noreferrer">
              Linktree
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;

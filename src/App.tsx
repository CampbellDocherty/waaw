import { ReactP5Wrapper } from '@p5-wrapper/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DeviceMotionEventiOS,
  requestDeviceMotionPermission,
} from './functions/requestDeviceMotionPermission';
import { sketch } from './sketch/sketch';
import { Star } from './functions/Star';
import { Game } from './Game';
import { GameOver } from './GameOver';
import { About } from './About';
import { NextPartyPopup } from './NextPartyPopup';
import { fetchPortfolio, Portfolio } from './portfolio';

const App = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [portfolioError, setPortfolioError] = useState(false);

  const isProbablyWeb =
    (DeviceMotionEvent as unknown as DeviceMotionEventiOS).requestPermission ===
    undefined;

  const star = useMemo(() => new Star(0, -120, 0, 0), []);

  const onStart = useCallback(async () => {
    return requestDeviceMotionPermission(star);
  }, [star]);

  useEffect(() => {
    fetchPortfolio()
      .then((portfolio) => {
        if (!portfolio) {
          setPortfolioError(true);
          return;
        }

        setPortfolio(portfolio);
      })
      .catch(() => {
        setPortfolioError(true);
      });
  }, []);

  const sketchWithPortfolio = useCallback(
    (p5: Parameters<typeof sketch>[0]) => {
      if (!portfolio) return;

      sketch(p5, star, onStart, isProbablyWeb, portfolio);
    },
    [isProbablyWeb, onStart, portfolio, star]
  );

  if (portfolioError) {
    return <div className="portfolio-status">Unable to load portfolio.</div>;
  }

  if (!portfolio) {
    return (
      <div className="portfolio-status loading-screen">
        <p className="loading-text">
          Loading
          <span className="loading-dots" aria-hidden="true" />
        </p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {portfolio.nextParty?.poster && portfolio.nextParty.link && (
        <NextPartyPopup
          poster={portfolio.nextParty.poster}
          link={portfolio.nextParty.link}
        />
      )}
      <div className="panel panel-title">
        <div className="desktop-title">
          <div className="desktop-title-letters">
            <span>W</span>
            <span>A</span>
            <span>A</span>
            <span>W</span>
          </div>
          <img
            src={portfolio.logo}
            alt="WAAW logo"
            className="desktop-title-logo"
          />
        </div>
      </div>
      <div className="panel panel-game">
        <Game isProbablyWeb={isProbablyWeb} />
        <About
          image={portfolio.image}
          aboutText={portfolio.aboutText}
          instagramLink={portfolio.instagramLink}
          mixesLink={portfolio.mixesLink}
          upcomingLink={portfolio.upcomingLink}
        />
        <About
          image={portfolio.image}
          aboutText={portfolio.aboutText}
          instagramLink={portfolio.instagramLink}
          mixesLink={portfolio.mixesLink}
          upcomingLink={portfolio.upcomingLink}
          showBackButton={false}
          className="motion-denied-screen"
        >
          <button className="motion-denied-retry">Click to play!</button>
        </About>
        <GameOver />
        <ReactP5Wrapper sketch={sketchWithPortfolio} />
      </div>
      <div className="panel panel-right">
        <img src={portfolio.image} alt="WAAW" className="right-image" />
        <About
          image={portfolio.image}
          aboutText={portfolio.aboutText}
          instagramLink={portfolio.instagramLink}
          mixesLink={portfolio.mixesLink}
          upcomingLink={portfolio.upcomingLink}
        />
        <ul className="right-links">
          <li>
            <a
              href={portfolio.instagramLink}
              target="_blank"
              rel="noreferrer"
            >
              instagram
            </a>
          </li>
          <li>
            <a href={portfolio.upcomingLink} target="_blank" rel="noreferrer">
              upcoming
            </a>
          </li>
          <li>
            <a href={portfolio.mixesLink} target="_blank" rel="noreferrer">
              mixes
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;

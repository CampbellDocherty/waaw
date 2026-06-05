import theTwins from './images/the-twins.jpg';

export const About = () => (
  <div className="about-screen">
    <button id="back-from-about-btn" className="bottom-left">
      {'<-'} game
    </button>
    <img src={theTwins} alt="WAAW" className="about-image" />
    <div className="about-content">
      <p>
        WAAW are a twin DJ duo, based in London.
      </p>
      <p>
        WAAW means yes in Wolof - a nod to their Gambian roots and their open
        and energetic approach to sound. Drawing influence from across the world
        and different genres, their mixes are a celebration of dance,
        resistance, and joy.
      </p>
      <p>
        They have a monthly residency on Foundation FM and have had guest shows
        on NTS, Balamii, Subtle Radio and Reprezent. They have recently played
        at Les Amis (Germany), We Out Here Festival (UK), and Boiler Room (UK).
      </p>
    </div>
    <ul className="about-links">
      <li>
        <a href="https://www.instagram.com/waawdj/" target="_blank" rel="noreferrer">
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
);

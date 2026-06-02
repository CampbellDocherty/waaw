import theTwins from './images/the-twins.jpg';

export const Socials = () => (
  <div className="social-screen">
    <button className="bottom-right">game {'->'}</button>
    <div className="socials-inner">
      <img src={theTwins} alt="WAAW" className="socials-image" />
      <ul>
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

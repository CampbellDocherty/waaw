type AboutProps = {
  image: string;
  aboutText: string;
};

export const About = ({ image, aboutText }: AboutProps) => (
  <div className="about-screen">
    <button id="back-from-about-btn" className="bottom-left">
      {'<-'} game
    </button>
    <img src={image} alt="WAAW" className="about-image" />
    <div className="about-content">
      {aboutText
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
    </div>
    <ul className="about-links">
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
);

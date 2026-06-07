import type { ReactNode } from 'react';

type AboutProps = {
  image: string;
  aboutText: string;
  showBackButton?: boolean;
  className?: string;
  children?: ReactNode;
};

export const About = ({
  image,
  aboutText,
  showBackButton = true,
  className = '',
  children,
}: AboutProps) => (
  <div className={`about-screen ${className}`.trim()}>
    {showBackButton && (
      <button id="back-from-about-btn" className="bottom-left">
        {'<-'} game
      </button>
    )}
    <img src={image} alt="WAAW" className="about-image" />
    <div className="about-content">
      {aboutText
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
    </div>
    {children}
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

import type { ReactNode } from 'react';

type AboutProps = {
  image: string;
  aboutText: string;
  instagramLink: string;
  mixesLink: string;
  upcomingLink: string;
  showBackButton?: boolean;
  className?: string;
  children?: ReactNode;
};

export const About = ({
  image,
  aboutText,
  instagramLink,
  mixesLink,
  upcomingLink,
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
        <a href={instagramLink} target="_blank" rel="noreferrer">
          instagram
        </a>
      </li>
      <li>
        <a href={upcomingLink} target="_blank" rel="noreferrer">
          upcoming
        </a>
      </li>
      <li>
        <a href={mixesLink} target="_blank" rel="noreferrer">
          mixes
        </a>
      </li>
    </ul>
  </div>
);

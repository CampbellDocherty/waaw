import { useEffect, useState } from 'react';

const DESKTOP_BREAKPOINT = 1024;
const DISMISSAL_KEY = 'waaw:next-party-dismissed';
const DISMISSAL_DURATION_MS = 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 3000;

export const SHOW_NEXT_PARTY_EVENT = 'waaw:next-party-show';

const wasDismissedRecently = () => {
  try {
    const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
    if (!dismissedAt) {
      return false;
    }

    const dismissedTime = Number(dismissedAt);
    if (Number.isNaN(dismissedTime)) {
      return false;
    }

    return Date.now() - dismissedTime < DISMISSAL_DURATION_MS;
  } catch {
    return false;
  }
};

type NextPartyPopupProps = {
  poster: string;
  link: string;
};

export const NextPartyPopup = ({ poster, link }: NextPartyPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const showPopup = () => {
      if (!wasDismissedRecently()) {
        setIsOpen(true);
      }
    };

    const handleMobileShowRequest = () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        showPopup();
      }
    };

    let timer: number | undefined;

    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      timer = window.setTimeout(showPopup, SHOW_DELAY_MS);
    }

    window.addEventListener(SHOW_NEXT_PARTY_EVENT, handleMobileShowRequest);

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }

      window.removeEventListener(
        SHOW_NEXT_PARTY_EVENT,
        handleMobileShowRequest
      );
    };
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(DISMISSAL_KEY, String(Date.now()));
    } catch {
      // Ignore storage failures and still close the popup.
    }

    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="next-party-popup is-visible">
      <div className="next-party-popup-header">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="next-party-popup-poster-link"
        >
          <img
            src={poster}
            alt="Next party poster"
            className="next-party-popup-poster"
          />
        </a>
        <button
          type="button"
          className="next-party-popup-close"
          aria-label="Close next party popup"
          onClick={handleClose}
        >
          x
        </button>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="next-party-popup-cta"
      >
        Buy tickets!
      </a>
    </div>
  );
};

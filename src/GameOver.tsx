import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { GameUser, getUsers, StoredGameUser } from './gameUsers';
import { LEADERBOARD_REFRESH_EVENT } from './leaderboard';

const STAR_SIZE = 26;

const getStarPoints = (points: number, length: number): string => {
  const pointCount = Math.max(3, points || 5);
  const centre = STAR_SIZE / 2;
  const outerRadius = STAR_SIZE / 2 - 2;
  const innerRadius = Math.max(
    3,
    Math.min((length / 30) * outerRadius, outerRadius - 1)
  );
  const step = Math.PI / pointCount;

  return Array.from({ length: pointCount * 2 }, (_, index) => {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = index * step - Math.PI / 2;
    const x = centre + Math.cos(angle) * radius;
    const y = centre + Math.sin(angle) * radius;
    return `${x},${y}`;
  }).join(' ');
};

const getCurrentUserId = (): string | null => {
  const starPrefs = localStorage.getItem('starPrefs');
  if (!starPrefs) {
    return null;
  }

  try {
    const prefs = JSON.parse(starPrefs) as { id?: string };
    return prefs.id ?? null;
  } catch {
    return null;
  }
};

const getTransparentColour = (colour: string, alpha: number): string => {
  if (colour.toLowerCase() === 'white') {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  const hex = colour.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const getCurrentUserRowStyle = (colour: string): CSSProperties => ({
  backgroundColor: getTransparentColour(colour, 0.1),
  boxShadow: `inset 2px 0 0 ${getTransparentColour(colour, 0.5)}`,
});

const LeaderboardStar = ({ user }: { user: GameUser }) => {
  const starPoints = useMemo(
    () => getStarPoints(user.points, user.length),
    [user.length, user.points]
  );

  return (
    <svg
      className="leaderboard-star"
      width={STAR_SIZE}
      height={STAR_SIZE}
      viewBox={`0 0 ${STAR_SIZE} ${STAR_SIZE}`}
      aria-hidden="true"
    >
      <polygon points={starPoints} fill={user.colour} />
    </svg>
  );
};

export const GameOver = () => {
  const [users, setUsers] = useState<StoredGameUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [leaderboardError, setLeaderboardError] = useState(false);

  const refreshLeaderboard = useCallback(() => {
    setCurrentUserId(getCurrentUserId());
    setLeaderboardError(false);
    void getUsers()
      .then(setUsers)
      .catch(() => setLeaderboardError(true));
  }, []);

  useEffect(() => {
    refreshLeaderboard();
    window.addEventListener(LEADERBOARD_REFRESH_EVENT, refreshLeaderboard);

    return () => {
      window.removeEventListener(LEADERBOARD_REFRESH_EVENT, refreshLeaderboard);
    };
  }, [refreshLeaderboard]);

  return (
    <div className="game-over-screen" style={{ display: 'none' }}>
      <h4>You scored</h4>
      <h3 className="final-score">0</h3>

      <section className="leaderboard" aria-label="Leaderboard">
        <h4 className="leaderboard-title">Leaderboard</h4>
        {leaderboardError ? (
          <p className="leaderboard-status">Unable to load leaderboard.</p>
        ) : (
          <ol className="leaderboard-list">
            {users.map((user, index) => {
              const isCurrentUser = user.id === currentUserId;

              return (
                <li
                  className={`leaderboard-row${
                    isCurrentUser ? ' leaderboard-row-current' : ''
                  }`}
                  key={user.firebaseId}
                  style={
                    isCurrentUser
                      ? getCurrentUserRowStyle(user.colour)
                      : undefined
                  }
                >
                  <span className="leaderboard-rank">#{index + 1}</span>
                  <LeaderboardStar user={user} />
                  <span className="leaderboard-name">{user.name || '???'}</span>
                  <span className="leaderboard-score">{user.score}</span>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <button className="play-again-button">Play again</button>
    </div>
  );
};

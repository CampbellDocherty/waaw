import { useCallback, useEffect, useMemo, useState } from 'react';
import { LEADERBOARD_REFRESH_EVENT } from './leaderboard';
import { getUsers, User } from './portfolio';

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

const LeaderboardStar = ({ user }: { user: User }) => {
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
  const [users, setUsers] = useState<User[]>([]);
  const [leaderboardError, setLeaderboardError] = useState(false);

  const refreshLeaderboard = useCallback(() => {
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
            {users.map((user) => (
              <li className="leaderboard-row" key={user._id}>
                <LeaderboardStar user={user} />
                <span className="leaderboard-name">{user.name || '???'}</span>
                <span className="leaderboard-score">{user.score}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <button className="play-again-button">Play again</button>
    </div>
  );
};

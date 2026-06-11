export const FRAME_MS_AT_60_FPS = 16.67;
export const SCORE_PER_FRAME_AT_60_FPS = 10;
export const MAX_SCORE = 35000;

export function getNextScore(currentScore: number, deltaMs: number): number {
  const deltaFrames = deltaMs / FRAME_MS_AT_60_FPS;

  return Math.round(
    Math.min(currentScore + SCORE_PER_FRAME_AT_60_FPS * deltaFrames, MAX_SCORE)
  );
}

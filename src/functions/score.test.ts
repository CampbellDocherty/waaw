import { describe, expect, it } from 'vitest';
import { getNextScore } from './score';

describe('getNextScore', () => {
  it('keeps delta-controlled score increments as whole numbers', () => {
    expect(getNextScore(0, 33.33)).toBe(20);
  });
});

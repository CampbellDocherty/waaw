import { render } from '@testing-library/react';
import { describe, test } from 'vitest';
import App from './App';

describe('When the app renders', () => {
  test('it renders', () => {
    render(<App />);
  });
});

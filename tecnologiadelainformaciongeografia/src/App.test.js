import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Portafolio WebMapping/i);
  expect(titleElement).toBeInTheDocument();
});

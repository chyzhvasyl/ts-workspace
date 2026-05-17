import { BrowserRouter } from 'react-router-dom';

import { render, screen, within } from '@testing-library/react';

import App from './app';

// Prevent fetch ECONNREFUSED noise during unit tests
global.fetch = vi.fn().mockResolvedValue({
  json: async () => ({ message: '' }),
});

describe('App', () => {
  const renderApp = () =>
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

  it('should render successfully', () => {
    const { baseElement } = renderApp();

    expect(baseElement).toBeTruthy();
  });

  it('should display the root route content', () => {
    renderApp();

    expect(screen.getByText(/This is the generated root route/i)).toBeTruthy();
  });

  it('should display navigation links', () => {
    renderApp();

    const nav = screen.getByRole('navigation');

    expect(within(nav).getByRole('link', { name: /^home$/i })).toBeTruthy();
    expect(within(nav).getByRole('link', { name: /^page 2$/i })).toBeTruthy();
  });
});

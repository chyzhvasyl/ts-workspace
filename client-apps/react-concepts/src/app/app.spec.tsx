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

    expect(
      screen.getByRole('heading', { level: 1, name: /^react concepts$/i }),
    ).toBeTruthy();
  });

  it('should display navigation links', () => {
    renderApp();

    const nav = screen.getByRole('navigation');

    expect(within(nav).getByRole('link', { name: /home/i })).toBeTruthy();
    expect(within(nav).getByRole('link', { name: /rendering/i })).toBeTruthy();
    expect(within(nav).getByRole('link', { name: /hooks/i })).toBeTruthy();
    expect(within(nav).getByRole('link', { name: /context/i })).toBeTruthy();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import * as api from './api/user-api';
import { UserPage } from './user-page';

vi.mock('./api/user-api');

describe('<UserPage /> – create', () => {
  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={['/users/new']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/users/new" element={<UserPage />} />
        </Routes>
      </MemoryRouter>,
    );

  it('should show empty form with save disabled initially', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/First Name/i)).toHaveValue('');
      expect(screen.getByLabelText(/Last Name/i)).toHaveValue('');
      expect(screen.getByLabelText(/Email/i)).toHaveValue('');
      expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
    });
  });

  it('should enable save when form is valid', async () => {
    renderPage();

    await userEvent.type(screen.getByLabelText(/First Name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'jane@example.com');

    expect(screen.getByRole('button', { name: /Save/i })).toBeEnabled();
  });

  it('should call createUser and redirect when Save clicked', async () => {
    const mockCreate = vi.fn().mockResolvedValue({ id: '1' });
    vi.spyOn(api, 'createUser').mockImplementation(mockCreate);

    renderPage();

    await userEvent.type(screen.getByLabelText(/First Name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'jane@example.com');

    await userEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
        }),
      );
    });
  });

  it('should go back when Cancel clicked', async () => {
    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(window.location.pathname).toBe('/');
  });
});

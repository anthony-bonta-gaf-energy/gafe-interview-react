import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from './api/user-api';
import { UserPage } from './user-page';
import { UserType } from './user.mjs';

vi.mock('./api/user-api');

describe('<UserPage /> – create', () => {
  const renderCreate = () =>
    render(
      <MemoryRouter initialEntries={['/users/new']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/users/new" element={<UserPage />} />
        </Routes>
      </MemoryRouter>,
    );

  it('shows an empty form and Save disabled initially', async () => {
    renderCreate();
    await waitFor(() => {
      expect(screen.getByLabelText(/First Name/i)).toHaveValue('');
      expect(screen.getByLabelText(/Last Name/i)).toHaveValue('');
      expect(screen.getByLabelText(/Email/i)).toHaveValue('');
      expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
    });
  });

  it('enables Save when the form becomes valid', async () => {
    renderCreate();
    await userEvent.type(screen.getByLabelText(/First Name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'jane@example.com');
    expect(screen.getByRole('button', { name: /Save/i })).toBeEnabled();
  });

  it('calls createUser and redirects when Save is clicked', async () => {
    const mockCreate = vi.fn().mockResolvedValue({ id: '1' });
    vi.spyOn(api, 'createUser').mockImplementation(mockCreate);
    renderCreate();
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
      expect(window.location.pathname).toBe('/');
    });
  });

  it('returns to list when Cancel is clicked', async () => {
    renderCreate();
    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(window.location.pathname).toBe('/');
  });

  it('shows error after blur on a required field', async () => {
    renderCreate();
    const firstNameInput = screen.getByLabelText(/First Name/i);
    firstNameInput.focus();
    firstNameInput.blur();
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    });
  });
});

describe('<UserPage /> – edit', () => {
  const existing = {
    id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
    firstName: 'Tom',
    lastName: 'Sawyer',
    email: 'tom@email.fake',
    phoneNumber: '+1-214-555-7294',
    type: UserType.Basic,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api, 'getUser').mockResolvedValue(existing);
    vi.spyOn(api, 'patchUser').mockImplementation(async (_id, diff) => ({
      ...existing,
      ...diff,
    }));
  });

  const renderEdit = () =>
    render(
      <MemoryRouter initialEntries={[`/users/${existing.id}`]}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/users/:id" element={<UserPage />} />
        </Routes>
      </MemoryRouter>,
    );

  it('prefills the form and keeps Save disabled when clean', async () => {
    renderEdit();
    await waitFor(() => {
      expect(screen.getByLabelText(/First Name/i)).toHaveValue('Tom');
    });
    expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
  });

  it('enables Save when a field changes and disables when reverted', async () => {
    renderEdit();
    const firstName = await screen.findByLabelText(/First Name/i);
    await userEvent.clear(firstName);
    await userEvent.type(firstName, 'Thomas');
    expect(screen.getByRole('button', { name: /Save/i })).toBeEnabled();
    await userEvent.clear(firstName);
    await userEvent.type(firstName, 'Tom');
    expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled();
  });

  it('does not call patchUser if form is reverted to original', async () => {
    const patchMock = vi.spyOn(api, 'patchUser');
    renderEdit();
    const firstName = await screen.findByLabelText(/First Name/i);

    await userEvent.clear(firstName);
    await userEvent.type(firstName, 'Thomas');

    await userEvent.clear(firstName);
    await userEvent.type(firstName, 'Tom');

    await userEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(patchMock).not.toHaveBeenCalled();
    });
  });

  it('returns to list on Cancel without saving', async () => {
    renderEdit();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(api.patchUser).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });
});

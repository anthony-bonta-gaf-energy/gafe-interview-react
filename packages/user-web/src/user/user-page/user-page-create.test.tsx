import { cleanup, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { History, createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as usersApi from '../../api/users.js';
import { UserType, UserTypeSelect } from '../user.mjs';
import { UserPage } from './index.js';

const { newUser } = vi.hoisted(() => {
  const newUser = {
    firstName: 'New',
    lastName: 'User',
    email: 'new.user@example.com',
    type: 'basic' as UserType,
  };
  return {
    newUser,
  };
});

// Mocking API Call
vi.spyOn(usersApi, 'createUser').mockReturnValue(
  new Promise(resolve =>
    resolve({
      ok: true,
      data: {
        id: 'new-id',
        ...newUser,
      },
    }),
  ),
);

interface GetViewArgs {
  history: History;
}

describe('User Page - Create User', async () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  const getView = (args?: GetViewArgs) => {
    const $args = {
      history: createMemoryHistory(),
      ...args,
    };

    const page = render(
      <Router location={$args.history.location} navigator={$args.history}>
        <UserPage />
      </Router>,
    );

    return Promise.resolve({
      page,
    });
  };

  it('should render an empty form for a new user and allow input', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/users/new'] });
    const { page } = await getView({ history });

    const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastNameInput = page.getByLabelText(/Last Name/i) as HTMLInputElement;
    const emailInput = page.getByLabelText(/Email/i) as HTMLInputElement;
    const phoneNumberInput = page.getByLabelText(/Phone Number/i) as HTMLInputElement;
    const typeSelect = page.getByLabelText(/Type/i) as HTMLSelectElement;
    const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;

    expect(firstNameInput.value).toBe('');
    expect(lastNameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(phoneNumberInput.value).toBe('');
    expect(typeSelect.value).toBe(UserTypeSelect.Empty);
    expect(saveButton).toBeDefined();

    await user.type(firstNameInput, newUser.firstName);
    await user.type(lastNameInput, newUser.lastName);
    await user.type(emailInput, newUser.email);
    await user.type(phoneNumberInput, '1234567890');
    await user.selectOptions(typeSelect, newUser.type);

    expect(firstNameInput.value).toBe(newUser.firstName);
    expect(lastNameInput.value).toBe(newUser.lastName);
    expect(emailInput.value).toBe(newUser.email);
    expect(phoneNumberInput.value).toBe('1234567890');
    expect(typeSelect.value).toBe(newUser.type);
  });

  it('should disable Save Button when required fields are empty (new user)', async () => {
    const history = createMemoryHistory({ initialEntries: ['/users/new'] });
    const { page } = await getView({ history });

    const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(saveButton.disabled).toBeTruthy(); // Initial check before changes

    const user = userEvent.setup();
    const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastNameInput = page.getByLabelText(/Last Name/i) as HTMLInputElement;
    const emailInput = page.getByLabelText(/Email/i) as HTMLInputElement;
    const phoneNumberInput = page.getByLabelText(/Phone Number/i) as HTMLInputElement;

    await user.type(firstNameInput, newUser.firstName);
    await user.type(lastNameInput, newUser.lastName);
    await user.type(emailInput, newUser.email);
    await user.type(phoneNumberInput, '123'); // Non-required field

    expect(saveButton.disabled).toBeTruthy(); // Should still be disabled - Type selection is still missing
  });

  it('should enable Save button when all required fields are filled (new user)', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/users/new'] });
    const { page } = await getView({ history });

    const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastNameInput = page.getByLabelText(/Last Name/i) as HTMLInputElement;
    const emailInput = page.getByLabelText(/Email/i) as HTMLInputElement;
    const typeSelect = page.getByLabelText(/Type/i) as HTMLSelectElement;
    const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;

    await user.type(firstNameInput, newUser.firstName);
    await user.type(lastNameInput, newUser.lastName);
    await user.type(emailInput, newUser.email);
    await user.selectOptions(typeSelect, newUser.type);

    expect(saveButton.disabled).toBeFalsy();
  });

  it('should create a new user and navigate to list on Save', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/users/new'] });
    const { page } = await getView({ history });

    const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastNameInput = page.getByLabelText(/Last Name/i) as HTMLInputElement;
    const emailInput = page.getByLabelText(/Email/i) as HTMLInputElement;
    const typeSelect = page.getByLabelText(/Type/i) as HTMLSelectElement;
    const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;

    await user.type(firstNameInput, newUser.firstName);
    await user.type(lastNameInput, newUser.lastName);
    await user.type(emailInput, newUser.email);
    await user.selectOptions(typeSelect, newUser.type);
    await user.click(saveButton);

    expect(usersApi.createUser).toHaveBeenCalledTimes(1);
    expect(usersApi.createUser).toHaveBeenCalledWith(newUser);
    expect(history.location.pathname).toEqual('/');
  });

  it('should navigate to list on Cancel without saving', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ['/users/new'] });
    const { page } = await getView({ history });

    const cancelButton = page.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(usersApi.createUser).not.toHaveBeenCalled();
    expect(history.location.pathname).toEqual('/');
  });
});

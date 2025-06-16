import { cleanup, render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { History, createMemoryHistory } from 'history';
import { Params, Router } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as usersApi from '../../api/users.js';
import { UserType } from '../user.mjs';
import { UserPage } from './index.js';

const { existingUserId, mockExistingUser } = vi.hoisted(() => {
  const existingUserId = 'user-1';
  const mockExistingUser = {
    id: existingUserId,
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: '555-123-4567',
    email: 'jane.doe@example.com',
    type: 'basic' as UserType,
  };
  return {
    existingUserId,
    mockExistingUser,
  };
});

vi.mock('react-router', async importOriginal => {
  const actual = (await importOriginal()) satisfies typeof import('react-router');
  return {
    // Preserve all original exports from react-router
    ...actual,
    // Override only the useParams function
    // The 'satisfies' operator ensures type safety without changing the return type
    useParams: () => ({ id: existingUserId } satisfies Readonly<Params<string>>), // Using Partial allows us to mock only what we need
  };
});

vi.spyOn(usersApi, 'getUserById').mockReturnValue(
  new Promise(resolve =>
    resolve({
      ok: true,
      data: {
        ...mockExistingUser,
      },
    }),
  ),
);

vi.spyOn(usersApi, 'updateUser').mockReturnValue(
  new Promise(resolve =>
    resolve({
      ok: true,
      data: {
        ...mockExistingUser,
        firstName: 'John',
      },
    }),
  ),
);

interface GetViewArgs {
  history: History;
}

describe('User Page - Existing User', () => {
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

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should populate the form with existing user data', async () => {
    const history = createMemoryHistory({ initialEntries: [`/users/${existingUserId}`] });
    const { page } = await getView({ history });

    // Wait for user data to load and fields to be pre-filled.
    await waitFor(() => {
      const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
      const lastNameInput = page.getByLabelText(/Last Name/i) as HTMLInputElement;
      const emailInput = page.getByLabelText(/Email/i) as HTMLInputElement;
      const phoneNumberInput = page.getByLabelText(/Phone Number/i) as HTMLInputElement;
      const typeSelect = page.getByLabelText(/Type/i) as HTMLSelectElement;

      expect(firstNameInput.defaultValue).toBe(mockExistingUser.firstName);
      expect(lastNameInput.defaultValue).toBe(mockExistingUser.lastName);
      expect(emailInput.defaultValue).toBe(mockExistingUser.email);
      expect(phoneNumberInput.defaultValue).toBe(mockExistingUser.phoneNumber);
      expect(typeSelect.value).toBe(mockExistingUser.type);

      expect(usersApi.getUserById).toHaveBeenCalledTimes(1);
      expect(usersApi.getUserById).toHaveBeenCalledWith(existingUserId);
    });
  });

  it('Save button should be disabled on initial load for existing user (clean form)', async () => {
    const history = createMemoryHistory({ initialEntries: [`/users/${existingUserId}`] });
    const { page } = await getView({ history });

    await waitFor(() => {
      const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
      expect(saveButton.disabled).toBeTruthy(); // Assertion: Should be disabled if no changes.
    });
  });

  it('Save button should be enabled when existing user data is changed', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [`/users/${existingUserId}`] });
    const { page } = await getView({ history });

    await waitFor(async () => {
      const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
      const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
      const selectInput = page.getByLabelText(/Type/i) as HTMLSelectElement;

      expect(firstNameInput.value).toBe(mockExistingUser.firstName);
      expect(selectInput.value).toBe(mockExistingUser.type);
      expect(saveButton.disabled).toBeTruthy();

      // Simulate a change in a field.
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'John');
      await user.selectOptions(selectInput, UserType.Admin);
      expect(selectInput.value).toBe(UserType.Admin);
      expect(firstNameInput.value).toBe('John');
      expect(saveButton.disabled).toBeFalsy();
    });
  });

  it('Save button should be disabled when changes are reverted to original state', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [`/users/${existingUserId}`] });
    const { page } = await getView({ history });

    await waitFor(async () => {
      const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
      const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
      const emailInput = page.getByLabelText(/Email/i) as HTMLInputElement;

      expect(firstNameInput.value).toBe(mockExistingUser.firstName);
      expect(saveButton.disabled).toBeTruthy();

      // 1. Simulate a change in the email.
      await user.clear(emailInput);
      await user.type(emailInput, '123@test.com');
      expect(saveButton.disabled).toBeFalsy(); // Button should enable.

      // 2. Revert the change to the original email.
      // To revert completely, first clear and then re-type the original value.
      await user.clear(emailInput);
      await user.type(emailInput, mockExistingUser.email);

      // 3.- Wait for the button to disable again.
      expect(saveButton.disabled).toBeTruthy();
    });
  });

  it('should update an existing user and navigate to list on Save', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [`/users/${existingUserId}`] });
    const { page } = await getView({ history });

    await waitFor(async () => {
      const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
      const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
      const updatedFirstName = 'John';

      expect(firstNameInput.value).toBe(mockExistingUser.firstName);
      expect(saveButton.disabled).toBeTruthy();

      // 1.- Simulate changing the first name.
      await user.clear(firstNameInput);
      await user.type(firstNameInput, updatedFirstName);

      expect(saveButton.disabled).toBeFalsy();

      await user.click(saveButton);

      // 2.- Saving user data
      expect(usersApi.updateUser).toHaveBeenCalledTimes(1);
      expect(usersApi.updateUser).toHaveBeenCalledWith(existingUserId, {
        firstName: updatedFirstName,
        lastName: mockExistingUser.lastName,
        phoneNumber: mockExistingUser.phoneNumber,
        email: mockExistingUser.email,
        type: mockExistingUser.type,
      });

      // 3.- Change navigation on save
      expect(history.location.pathname).toEqual('/');
    });
  });

  it('should navigate to list on Cancel without updating', async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: [`/users/${existingUserId}`] });
    const { page } = await getView({ history });

    await waitFor(async () => {
      const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
      const cancelButton = page.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement;

      expect(firstNameInput.value).toBe(mockExistingUser.firstName);
      await user.click(cancelButton);

      expect(usersApi.updateUser).not.toHaveBeenCalled();
      expect(history.location.pathname).toEqual('/');
    });
  });
});

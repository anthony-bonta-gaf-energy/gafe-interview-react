import { cleanup, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { History, createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { UserTypeSelect } from '../user.mjs';
import { UserPage } from './index.js';
interface GetViewArgs {
  history: History;
}

afterEach(cleanup);

describe('User Page - Create User', async () => {
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
    const typeSelect = page.getByLabelText(/Type/i) as HTMLOptionElement;
    const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;

    expect(firstNameInput.value).toBe('');
    expect(lastNameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(phoneNumberInput.value).toBe('');
    expect(typeSelect.value).toBe(UserTypeSelect.Empty);
    expect(saveButton).toBeDefined();

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(phoneNumberInput, '1234567890');
    await user.selectOptions(typeSelect, UserTypeSelect.Admin);

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(phoneNumberInput.value).toBe('1234567890');
    expect(typeSelect.value).toBe(UserTypeSelect.Admin);
  });

  it('should disable Save Button when required fields are empty (new user)', async () => {
    const history = createMemoryHistory({ initialEntries: ['/users/new'] });
    const { page } = await getView({ history });
    const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(saveButton.disabled).toBeTruthy();

    const user = userEvent.setup();
    const firstNameInput = page.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastNameInput = page.getByLabelText(/Last Name/i) as HTMLInputElement;
    const emailInput = page.getByLabelText(/Email/i) as HTMLInputElement;
    const phoneNumberInput = page.getByLabelText(/Phone Number/i) as HTMLInputElement;

    await user.type(firstNameInput, 'Test');
    await user.type(lastNameInput, 'User');
    await user.type(emailInput, 'test.user@example.com');
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
    const typeSelect = page.getByLabelText(/Type/i) as HTMLOptionElement;
    const saveButton = page.getByRole('button', { name: 'Save' }) as HTMLButtonElement;

    await user.type(firstNameInput, 'Test');
    await user.type(lastNameInput, 'User');
    await user.type(emailInput, 'test.user@example.com');
    await user.selectOptions(typeSelect, UserTypeSelect.Admin);

    expect(saveButton.disabled).toBeFalsy();
  });
});

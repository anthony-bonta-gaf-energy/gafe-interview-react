import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { History, createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { describe, expect, it } from 'vitest';
import { UserType } from '../user.mjs';
import { UserPage } from './index.js';
interface GetViewArgs {
  history: History;
}

describe('User Page', () => {
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
    const history = createMemoryHistory({ initialEntries: ['/users/new'] });
    const { page } = await getView({ history });
    expect(history.location.pathname).toEqual('/users/new');

    const user = userEvent.setup();
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
    expect(typeSelect.value).toBe(UserType.Basic);
    expect(saveButton).toBeDefined();

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(phoneNumberInput, '1234567890');
    await user.selectOptions(typeSelect, UserType.Admin);

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(phoneNumberInput.value).toBe('1234567890');
    expect(typeSelect.value).toBe(UserType.Admin);
  });
});

import { UserProvider } from '@/contexts/User';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { UserPage } from './user-page';

const MockUserProvider = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>{children}</UserProvider>
);

interface GetViewArgs {
  initialRoute?: string;
}

describe('User Page', () => {
  afterEach(() => {
    cleanup();
  });

  const getView = (args?: GetViewArgs) => {
    const $args = {
      initialRoute: '/users/new',
      ...args,
    };

    render(
      <MemoryRouter initialEntries={[$args.initialRoute]}>
        <Routes>
          <Route
            path="/users/:id"
            element={
              <MockUserProvider>
                <UserPage />
              </MockUserProvider>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    const getInput = (name: string) =>
      Promise.resolve(screen.getByLabelText(new RegExp(name, 'i')));

    const getSelect = (name: string) =>
      Promise.resolve(screen.getByRole('combobox', { name: new RegExp(name, 'i') }));

    const getHeader = () => Promise.resolve(screen.getByRole('heading', { name: /user profile/i }));

    const getCreateUserButton = () =>
      Promise.resolve(screen.getByText<HTMLButtonElement>('Create User'));

    const getUserTypeSelect = async () => await getSelect('user type');

    const populateInput = async (fieldName: string, value: string) => {
      const field = await getInput(fieldName);
      await userEvent.clear(field);
      await userEvent.type(field, value);
    };

    const populateSelect = async (fieldName: string, value: string) => {
      const selectElement = await getSelect(fieldName);
      await userEvent.selectOptions(selectElement, value);
    };

    return Promise.resolve({
      getInput,
      getHeader,
      getCreateUserButton,
      populateInput,
      populateSelect,
      getUserTypeSelect,
    });
  };

  it('should render create user form with all its fields', async () => {
    const view = await getView({ initialRoute: '/users/new' });

    const header = await view.getHeader();
    const firstNameInput = await view.getInput('first name');
    const lastNameInput = await view.getInput('last name');
    const phoneInput = await view.getInput('phone number');
    const emailInput = await view.getInput('email');
    const typeSelect = await view.getInput('user type');
    const submitButton = await view.getCreateUserButton();
    const select = await view.getUserTypeSelect();

    expect(header).toBeDefined();
    expect(firstNameInput).toBeDefined();
    expect(lastNameInput).toBeDefined();
    expect(phoneInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(typeSelect).toBeDefined();
    expect(submitButton).toBeDefined();
    expect(select).toBeDefined();

    expect(submitButton.textContent).toBe('Create User');
    expect(submitButton.disabled).toBe(true);
  });

  it('shoud render form and validate submit button when user fills the form', async () => {
    const view = await getView({ initialRoute: '/users/new' });

    const header = await view.getHeader();
    const firstNameInput = (await view.getInput('first name')) as HTMLInputElement;
    const lastNameInput = (await view.getInput('last name')) as HTMLInputElement;
    const phoneInput = (await view.getInput('phone number')) as HTMLInputElement;
    const emailInput = (await view.getInput('email')) as HTMLInputElement;
    const submitButton = await view.getCreateUserButton();
    const select = (await view.getUserTypeSelect()) as HTMLSelectElement;

    expect(header).toBeDefined();
    expect(firstNameInput).toBeDefined();
    expect(lastNameInput).toBeDefined();
    expect(phoneInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(submitButton).toBeDefined();
    expect(select).toBeDefined();

    expect(submitButton.textContent).toBe('Create User');

    await view.populateInput('first name', 'John');
    await view.populateInput('last name', 'Doe');
    await view.populateInput('email', 'some@email.fake');
    await view.populateSelect('type', 'admin');

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(phoneInput.value).toBe('');
    expect(emailInput.value).toBe('some@email.fake');
    expect(select.value).toBe('admin');
    expect(submitButton.disabled).toBe(false);
  });
});

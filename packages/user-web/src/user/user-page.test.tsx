import { UserProvider } from '@/contexts/User';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { UserPage } from './user-page';

const MockUserProvider = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>{children}</UserProvider>
);

interface GetViewArgs {
  initialRoute?: string;
}

describe('User Page', () => {
  const getView = (args?: GetViewArgs) => {
    const $args = {
      initialRoute: '/users/new',
      ...args,
    };

    let currentLocation: ReturnType<typeof useLocation>;

    const LocationCapture = () => {
      currentLocation = useLocation();
      return null;
    };

    render(
      <MemoryRouter initialEntries={[$args.initialRoute]}>
        <LocationCapture />
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

    const getHeader = () => Promise.resolve(screen.getByRole('heading', { name: /user profile/i }));

    const getCurrentPath = () => currentLocation?.pathname;

    const getCreateUserButton = () =>
      Promise.resolve(screen.getByText<HTMLButtonElement>('Create User'));

    const populateField = async (fieldName: string, value: string) => {
      const field = await getInput(fieldName);
      await userEvent.clear(field);
      await userEvent.type(field, value);
    };

    return Promise.resolve({
      getInput,
      getHeader,
      getCurrentPath,
      getCreateUserButton,
      populateField,
    });
  };

  it('shoud render create user form with all its fields', async () => {
    const view = await getView({ initialRoute: '/users/new' });

    const header = await view.getHeader();
    const firstNameInput = await view.getInput('first name');
    const lastNameInput = await view.getInput('last name');
    const phoneInput = await view.getInput('phone number');
    const emailInput = await view.getInput('email');
    const typeSelect = await view.getInput('user type');
    const submitButton = await view.getCreateUserButton();

    await view.populateField('first name', 'John');
    await view.populateField('last name', 'Doe');

    expect(header).toBeDefined();

    expect(firstNameInput).toBeDefined();
    expect(lastNameInput).toBeDefined();
    expect(phoneInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(typeSelect).toBeDefined();
    expect(submitButton).toBeDefined();
    expect(submitButton.textContent).toBe('Create User');

    expect(firstNameInput.getAttribute('value')).toEqual('John');
    expect(lastNameInput.getAttribute('value')).toEqual('Doe');
  });
});

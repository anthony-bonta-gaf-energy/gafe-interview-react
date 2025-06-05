import { UserProvider } from '@/contexts/User';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserPage } from './user-page';

// Mock the services
// vi.mock('@/services/users', () => ({
//   getUserById: vi.fn(),
//   saveUser: vi.fn(),
//   updateUser: vi.fn(),
// }));

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

    // const getSubmitButton = () =>
    //   Promise.resolve(screen.getByRole('button', { name: /create user|update user/i }));

    // const getBackLink = () => Promise.resolve(screen.getByRole('link', { name: /go back/i }));

    // const fillForm = async (userData: Partial<User>) => {
    //   if (userData.firstName) {
    //     const firstNameInput = await getInput('first name');
    //     await userEvent.clear(firstNameInput);
    //     await userEvent.type(firstNameInput, userData.firstName);
    //   }

    //   if (userData.lastName) {
    //     const lastNameInput = await getInput('last name');
    //     await userEvent.clear(lastNameInput);
    //     await userEvent.type(lastNameInput, userData.lastName);
    //   }

    //   if (userData.email) {
    //     const emailInput = await getInput('email');
    //     await userEvent.clear(emailInput);
    //     await userEvent.type(emailInput, userData.email);
    //   }

    //   if (userData.phoneNumber) {
    //     const phoneInput = await getInput('phone number');
    //     await userEvent.clear(phoneInput);
    //     await userEvent.type(phoneInput, userData.phoneNumber);
    //   }

    //   if (userData.type) {
    //     const typeSelect = await getInput('user type');
    //     await userEvent.selectOptions(typeSelect, userData.type);
    //   }
    // };

    // const submitForm = async () => {
    //   const submitButton = await getSubmitButton();
    //   await userEvent.click(submitButton);
    // };

    // const clickBackLink = async () => {
    //   const backLink = await getBackLink();
    //   await userEvent.click(backLink);
    // };

    return Promise.resolve({
      getInput,
      getHeader,
      getCurrentPath,
      getCreateUserButton,
      // getSubmitButton,
      // getBackLink,
      // fillForm,
      // submitForm,
      // clickBackLink,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shoud render create user form with all its fields', async () => {
    const view = await getView({ initialRoute: '/users/new' });
    const user = userEvent.setup();
    // screen.debug();

    const header = await view.getHeader();
    const firstNameInput = await view.getInput('first name');
    const lastNameInput = await view.getInput('last name');
    const phoneInput = await view.getInput('phone number');
    const emailInput = await view.getInput('email');
    const typeSelect = await view.getInput('user type');
    const submitButton = await view.getCreateUserButton();

    // Fill in the first name input with test data
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'John');

    // screen.debug();

    expect(header).toBeDefined();

    expect(firstNameInput).toBeDefined();
    expect(lastNameInput).toBeDefined();
    expect(phoneInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(typeSelect).toBeDefined();
    expect(submitButton).toBeDefined();
    expect(submitButton.textContent).toBe('Create User');

    expect(firstNameInput.getAttribute('value')).toBe('John');
  });
});

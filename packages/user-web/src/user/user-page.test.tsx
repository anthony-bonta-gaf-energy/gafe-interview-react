import { UserProvider } from '@/contexts/User';
import type { User } from '@/services/users';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserPage } from './user-page';

// Mock the services
vi.mock('@/services/users', () => ({
  getUserById: vi.fn(),
  saveUser: vi.fn(),
  updateUser: vi.fn(),
}));

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

    render(
      <MemoryRouter initialEntries={[$args.initialRoute]}>
        <Routes>
          <Route
            path="*"
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

    const getSubmitButton = () =>
      Promise.resolve(screen.getByRole('button', { name: /create user|update user/i }));

    const getBackLink = () => Promise.resolve(screen.getByRole('link', { name: /go back/i }));

    const fillForm = async (userData: Partial<User>) => {
      if (userData.firstName) {
        const firstNameInput = await getInput('first name');
        await userEvent.clear(firstNameInput);
        await userEvent.type(firstNameInput, userData.firstName);
      }

      if (userData.lastName) {
        const lastNameInput = await getInput('last name');
        await userEvent.clear(lastNameInput);
        await userEvent.type(lastNameInput, userData.lastName);
      }

      if (userData.email) {
        const emailInput = await getInput('email');
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, userData.email);
      }

      if (userData.phoneNumber) {
        const phoneInput = await getInput('phone number');
        await userEvent.clear(phoneInput);
        await userEvent.type(phoneInput, userData.phoneNumber);
      }

      if (userData.type) {
        const typeSelect = await getInput('user type');
        await userEvent.selectOptions(typeSelect, userData.type);
      }
    };

    const submitForm = async () => {
      const submitButton = await getSubmitButton();
      await userEvent.click(submitButton);
    };

    const clickBackLink = async () => {
      const backLink = await getBackLink();
      await userEvent.click(backLink);
    };

    return Promise.resolve({
      getInput,
      getSubmitButton,
      getBackLink,
      fillForm,
      submitForm,
      clickBackLink,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shoud render something basic', async () => {
    const view = await getView({ initialRoute: '/users/new' });
    screen.debug();
    expect(1).toBe(1); // Placeholder for basic render test
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as userService from './services/user.service.mts';
import { UserPage } from './user-page';

vi.mock('./services/user.service.mts', () => ({
  saveUser: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

interface GetViewArgs {
  history?: MemoryHistory;
}

describe('UserPage', () => {
  const getView = (args?: GetViewArgs) => {
    const history = args?.history ?? createMemoryHistory({ initialEntries: ['/users/new'] });

    const target = render(
      <Router location={history.location} navigator={history}>
        <UserPage />
      </Router>,
    );

    const getInput = (label: RegExp): Promise<HTMLInputElement> => {
      return Promise.resolve(screen.getByLabelText(label));
    };

    const getSelect = (label: RegExp): Promise<HTMLSelectElement> => {
      return Promise.resolve(screen.getByLabelText(label));
    };

    const fillInput = async (label: RegExp, value: string) => {
      const field = await getInput(label);

      await userEvent.clear(field);
      await userEvent.type(field, value);
    };

    const selectOption = async (label: RegExp, value: string) => {
      const select = await getSelect(label);
      await userEvent.selectOptions(select, value);
    };

    const getButton = (label: RegExp): Promise<HTMLButtonElement> => {
      return Promise.resolve(screen.getByRole('button', { name: label }));
    };

    const pressButton = async (label: RegExp) => {
      const button = await getButton(label);
      await userEvent.click(button);
    };

    return Promise.resolve({
      getInput,
      getSelect,
      getButton,

      fillInput,
      selectOption,
      pressButton,
    });
  };

  describe('Feature: Create a New User', () => {
    describe('Scenario: Allow me to fill out the form', () => {
      it('should see an empty user form', async () => {
        // Arrange
        const history = createMemoryHistory({ initialEntries: ['/users/new'] });
        const view = await getView({ history });

        // Act
        const firstNameInput = await view.getInput(/First Name/i);
        const lastNameInput = await view.getInput(/Last Name/i);
        const emailInput = await view.getInput(/Email/i);
        const phoneInput = await view.getInput(/Phone Number/i);
        const typeSelect = await view.getSelect(/Type/i);

        // Assert
        expect(firstNameInput.value).toBe('');
        expect(lastNameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(phoneInput.value).toBe('');
        expect(typeSelect.value).toBe('');
      });
      it('should allow the user to type in the form fields', async () => {
        // Arrange
        const mockUser = {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          email: 'john.doe@example.com',
          type: 'admin',
        };

        const history = createMemoryHistory({ initialEntries: ['/users/new'] });
        const view = await getView({ history });

        // Act
        await view.fillInput(/First Name/i, mockUser.firstName);
        await view.fillInput(/Last Name/i, mockUser.lastName);
        await view.fillInput(/Phone Number/i, mockUser.phoneNumber);
        await view.fillInput(/Email/i, mockUser.email);
        await view.selectOption(/Type/i, mockUser.type);

        // Assert
        const firstNameInput = await view.getInput(/First Name/i);
        const lastNameInput = await view.getInput(/Last Name/i);
        const emailInput = await view.getInput(/Email/i);
        const phoneInput = await view.getInput(/Phone Number/i);
        const typeSelect = await view.getSelect(/Type/i);

        expect(firstNameInput.value).toBe(mockUser.firstName);
        expect(lastNameInput.value).toBe(mockUser.lastName);
        expect(emailInput.value).toBe(mockUser.email);
        expect(phoneInput.value).toBe(mockUser.phoneNumber);
        expect(typeSelect.value).toBe(mockUser.type);
      });
    });

    describe('Scenario: Disable the save button when a required field is not entered', () => {
      const mockUser = {
        firstName: 'Juan',
        lastName: 'Perez',
        phoneNumber: '521234567890',
        email: 'juan.perez@example.com',
        type: 'admin',
      };

      const requiredFields = ['firstName', 'lastName', 'email', 'type'] as const;

      const fillFormExcept = async (view: Awaited<ReturnType<typeof getView>>, omitKey: string) => {
        const labelMap: Record<string, RegExp> = {
          firstName: /First Name/i,
          lastName: /Last Name/i,
          phoneNumber: /Phone Number/i,
          email: /Email/i,
          type: /Type/i,
        };

        for (const inputName of Object.keys(mockUser)) {
          if (inputName === omitKey) continue;

          const label = labelMap[inputName];
          const value = mockUser[inputName];
          if (!value) continue;

          if (inputName === 'type') {
            await view.selectOption(label, value);
          } else {
            await view.fillInput(label, value);
          }
        }
      };

      it.each(requiredFields)(
        'should disable the save button when %s is missing',
        async missingField => {
          // Arrange
          const history = createMemoryHistory({ initialEntries: ['/users/new'] });
          const view = await getView({ history });

          // Act
          await fillFormExcept(view, missingField);

          // Assert
          const saveButton = await view.getButton(/Save/i);
          expect(saveButton).toBeDisabled();
        },
      );
    });

    describe('Scenario: Save the user when the save button is clicked', () => {
      it('should save the user and navigate to user list', async () => {
        // Arrange
        const mockUser = {
          firstName: 'Juan',
          lastName: 'Perez',
          phoneNumber: '5212345678',
          email: 'juan.perez@example.com',
          type: 'admin',
        };

        const history = createMemoryHistory({ initialEntries: ['/users/new'] });
        const view = await getView({ history });

        // Act
        await view.fillInput(/First Name/i, mockUser.firstName);
        await view.fillInput(/Last Name/i, mockUser.lastName);
        await view.fillInput(/Phone Number/i, mockUser.phoneNumber);
        await view.fillInput(/Email/i, mockUser.email);
        await view.selectOption(/Type/i, mockUser.type);
        await view.pressButton(/Save/i);

        // Assert
        expect(userService.saveUser).toHaveBeenCalledWith(mockUser);
        expect(history.location.pathname).toBe('/');
      });
    });
  });

  describe('Update', () => {
    it('should update the user when the Save button is clicked', () => {});
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router } from 'react-router';
import { describe, expect, it } from 'vitest';
import { UserPage } from './user-page';

/**
 * Feature: Create a New User
 *
 * Scenario: Allow me to fill out the form
 * Given I am on the create user page
 * Then I should see an empty user form
 * And I should be able to enter in the information for <Field> of type <Type>
 */

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

    return Promise.resolve({
      getInput,
      getSelect,

      fillInput,
      selectOption,
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
  });

  describe('Update', () => {
    it('should update the user when the Save button is clicked', () => {});
  });
});

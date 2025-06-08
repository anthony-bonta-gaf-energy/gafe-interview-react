import { render, screen } from '@testing-library/react';
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

    return Promise.resolve({
      getInput,
      getSelect,
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
      it('should allow the user to type in the form fields', () => {});
    });
  });

  describe('Update', () => {
    it('should update the user when the Save button is clicked', () => {});
  });
});

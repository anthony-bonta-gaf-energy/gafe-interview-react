import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { UserPage } from './user-page';
import { User, UserType } from './user.mjs';

const MOCKED_USER: User = {
  id: '1',
  firstName: 'Tom',
  lastName: 'Sawyer',
  phoneNumber: '+1-214-555-7294',
  email: 'test@test.com',
  type: UserType.Admin,
};

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('UserPage', () => {
  const getView = (initialEntries: string[]) => {
    const RoutesStub = createRoutesStub([
      {
        path: '/',
        Component: () => 'User List Page',
      },
      {
        path: '/users/:id',
        Component: UserPage,
      },
    ]);
    render(<RoutesStub initialEntries={initialEntries} />);

    const clickSaveButton = async () => {
      const button = getSaveButton();
      await userEvent.click(button);
    };

    const getSaveButton = () => screen.getByTestId<HTMLButtonElement>('save-button');

    const updateInputElementByName = (
      name: 'first-name' | 'last-name' | 'phone-number' | 'email' | 'type',
      value: string,
    ) => {
      const element = screen.getByTestId(`${name}-input`);
      fireEvent.change(element, { target: { value } });
    };

    const getUserListPage = () => screen.getByText('User List Page');

    return Promise.resolve({
      getSaveButton,
      clickSaveButton,
      updateInputElementByName,
      getUserListPage,
    });
  };

  describe('Create', () => {
    it('should create the user when the Save button is clicked', async () => {
      // Arrange.
      const view = await getView(['/users/new']);
      fetchMock.mockResolvedValueOnce({ json: () => MOCKED_USER, ok: true });
      await waitFor(() => {
        // NOTE: wait for the save button to render
        expect(view.getSaveButton()).toBeTruthy();
      });

      // Act.
      view.updateInputElementByName('first-name', 'New');
      view.updateInputElementByName('last-name', 'User');
      view.updateInputElementByName('phone-number', '+1-214-555-7294');
      view.updateInputElementByName('email', 'test@test.com');
      view.updateInputElementByName('type', UserType.Admin);
      await view.clickSaveButton();

      // Assert.
      expect(fetchMock).toHaveBeenCalledWith('/api/users', {
        body: '{"firstName":"New","lastName":"User","phoneNumber":"+1-214-555-7294","email":"test@test.com","type":"admin"}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      expect(view.getUserListPage()).toBeTruthy();
    });

    afterEach(() => {
      vi.clearAllMocks();
      cleanup();
    });
  });

  describe('Update', () => {
    it('should update the user when the Save button is clicked', async () => {
      // Arrange.
      const view = await getView(['/users/test-id']);
      fetchMock.mockResolvedValueOnce({ json: () => MOCKED_USER, ok: true });
      await waitFor(() => {
        // NOTE: wait for inputs to have the existing user data
        expect(screen.getByDisplayValue(MOCKED_USER.firstName)).toBeTruthy();
      });

      // Act.
      view.updateInputElementByName('first-name', 'Newfirstname');
      await view.clickSaveButton();

      // Assert.
      expect(fetchMock).toHaveBeenCalledWith('/api/users/test-id', {
        body: '{"firstName":"Newfirstname"}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      });
      expect(view.getUserListPage()).toBeTruthy();
    });

    afterEach(() => {
      vi.clearAllMocks();
      cleanup();
    });
  });
});

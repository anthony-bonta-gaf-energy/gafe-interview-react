import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as router from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userInstance } from '../controllers/Users';
import { UserPage } from './user-page';
import { UserType } from './user.mjs';

vi.mock('../controllers/Users', () => ({
  userInstance: {
    getUser: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual: any = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => mockNavigate,
  };
});

function getView() {
  return render(
    <BrowserRouter>
      <UserPage />
    </BrowserRouter>,
  );
}

describe('UserPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create', () => {
    it('should create the user when the form is submitted', async () => {
      const mockCreateUser = vi.mocked(userInstance.createUser);
      mockCreateUser.mockResolvedValue({
        id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
        firstName: 'Tom',
        lastName: 'Sawyer',
        email: 'tom@email.fake',
        phoneNumber: '+1-214-555-7294',
        type: UserType.Basic,
      });

      (router.useParams as any).mockReturnValue({ id: undefined });

      getView();

      // Act.
      fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
        target: { value: '1234567890' },
      });
      fireEvent.change(screen.getByTestId('email-input'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: UserType.Admin },
      });

      fireEvent.submit(screen.getByTestId('user-form'));

      // Assert.
      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          email: 'john@example.com',
          type: UserType.Admin,
        });
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Update', () => {
    it('should update the user when the form is submitted', async () => {
      // Arrange.
      const mockUpdateUser = vi.mocked(userInstance.updateUser);
      const mockGetUser = vi.mocked(userInstance.getUser);

      const existingUser = {
        id: '123',
        firstName: 'Jane',
        lastName: 'Doe',
        phoneNumber: '0987654321',
        email: 'jane@example.com',
        type: UserType.Basic,
      };

      (router.useParams as any).mockReturnValue({ id: '123' });
      mockGetUser.mockResolvedValue(existingUser);

      getView();

      // Act.
      await waitFor(() => {
        expect(screen.getByDisplayValue('Jane')).to.exist;
      });

      // had to use getAllByPlaceholderText because the form is rendered twice because
      // of the stric mode in the test environment
      fireEvent.change(screen.getAllByPlaceholderText(/First Name/i)[1], {
        target: { value: 'Janet' },
      });

      fireEvent.submit(screen.getAllByTestId('user-form')[1]);

      // Assert.
      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith('123', {
          firstName: 'Janet',
          lastName: 'Doe',
          phoneNumber: '0987654321',
          email: 'jane@example.com',
          type: UserType.Basic,
        });

        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
});

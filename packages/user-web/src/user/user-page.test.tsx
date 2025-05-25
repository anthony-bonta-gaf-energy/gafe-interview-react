import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetUser, useMutateUser } from '../hooks/user';
import { UserPage } from './user-page';
import { User, UserType } from './user.mjs';

vi.mock('../hooks/user', () => ({
  useGetUser: vi.fn(),
  useMutateUser: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUser: User = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '1234567890',
  type: UserType.Admin,
};

describe('UserPage', () => {
  let mockMutate: ReturnType<typeof vi.fn>;
  let mockUseGetUser: ReturnType<typeof vi.fn>;
  let mockUseMutateUser: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMutate = vi.fn().mockResolvedValue({});
    mockUseMutateUser = useMutateUser as ReturnType<typeof vi.fn>;
    mockUseGetUser = useGetUser as ReturnType<typeof vi.fn>;

    mockUseMutateUser.mockReturnValue({
      mutate: mockMutate,
      loading: false,
    });
    mockUseGetUser.mockReturnValue({
      user: null,
      loading: false,
    });
  });

  const setup = (id?: string) => {
    const initialEntries = id ? [`/users/${id}`] : ['/users/new'];
    const path = id ? '/users/:id' : '/users/new';

    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path={path} element={<UserPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const getFirstNameInput = () => screen.getByLabelText<HTMLInputElement>(/First Name/i);
    const getLastNameInput = () => screen.getByLabelText<HTMLInputElement>(/Last Name/i);
    const getEmailInput = () => screen.getByLabelText<HTMLInputElement>(/Email/i);
    const getPhoneNumberInput = () => screen.getByLabelText<HTMLInputElement>(/Phone Number/i);
    const getTypeSelect = () => screen.getByRole('combobox')
    const getSubmitButton = () => screen.getByRole('button', { name: /Submit/i });
    const getCancelButton = () => screen.getByRole('button', { name: /Cancel/i });

    return {
      getFirstNameInput,
      getLastNameInput,
      getEmailInput,
      getPhoneNumberInput,
      getTypeSelect,
      getSubmitButton,
      getCancelButton,
    };
  };

  describe('Create', () => {
    it('should create the user when the Save button is clicked', async () => {
      const {
        getFirstNameInput,
        getLastNameInput,
        getEmailInput,
        getPhoneNumberInput,
        getTypeSelect,
        getSubmitButton,
      } = setup();

      await userEvent.type(getFirstNameInput(), 'Test');
      await userEvent.type(getLastNameInput(), 'User');
      await userEvent.type(getEmailInput(), 'test.user@example.com');
      await userEvent.type(getPhoneNumberInput(), '0987654321');
      await userEvent.selectOptions(getTypeSelect(), UserType.Basic);

      expect(getSubmitButton()).toBeEnabled();
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user@example.com',
            phoneNumber: '0987654321',
            type: UserType.Basic,
          }),
        );
      });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Update', () => {
    it('should update the user when the Save button is clicked', () => { });
    it('should prefill form and update the user when the Save button is clicked', async () => {
      mockUseGetUser.mockReturnValue({
        user: mockUser,
        loading: false,
      });

      const { getFirstNameInput, getSubmitButton } = setup(mockUser.id);

      await waitFor(() => {
        expect(getFirstNameInput()).toHaveValue(mockUser.firstName);
      });

      await userEvent.clear(getFirstNameInput());
      await userEvent.type(getFirstNameInput(), 'Updated John');

      expect(getSubmitButton()).toBeEnabled();
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({ ...mockUser, firstName: 'Updated John' }));
      });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Cancel', () => {
    it('should navigate to the home', async () => {
      const { getCancelButton } = setup();

      await userEvent.click(getCancelButton());

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    })
  })
});
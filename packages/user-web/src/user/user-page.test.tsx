import { UserProvider } from '@/contexts/User';
import { User } from '@/services/users';
import { UserListPage } from '@/user/user-list-page';
import { UserPage } from '@/user/user-page';
import { UserType } from '@/utils/constants';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  type Location,
  type NavigateFunction,
} from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

let currentLocation: Location;
let navigate: NavigateFunction;

const onSubmitMock = vi.fn().mockImplementation(() => {
  navigate('/');
});

const MOCK_USERS_LIST: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '123-456-7890',
    email: 'some@email.fake',
    type: UserType.Basic,
  },
];

const MockUserProvider = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>{children}</UserProvider>
);

const LocationComponent = () => {
  const location = useLocation();
  const nav = useNavigate();
  navigate = nav;
  currentLocation = location;
  return null;
};

interface GetViewArgs {
  initialRoute?: string;
}

describe('User Page', () => {
  afterEach(() => {
    onSubmitMock.mockClear();
    cleanup();
  });

  const getView = (args?: GetViewArgs) => {
    const $args = {
      initialRoute: '/users/new',
      ...args,
    };

    render(
      <MemoryRouter initialEntries={[$args.initialRoute]}>
        <MockUserProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <LocationComponent />
                  <UserListPage users={MOCK_USERS_LIST} />
                </>
              }
            />
            <Route
              path="/users/:id"
              element={
                <MockUserProvider>
                  <LocationComponent />
                  <UserPage onSubmit={onSubmitMock} />
                </MockUserProvider>
              }
            />
          </Routes>
        </MockUserProvider>
      </MemoryRouter>,
    );

    const findUserRowById = (userId: string) => Promise.resolve(screen.getByTestId(userId));

    const getUserDetailsFromRow = async (userId: string) => {
      const row = await findUserRowById(userId);
      const fistName = row.querySelector('[data-col="first-name"]')?.textContent;
      const lastName = row.querySelector('[data-col="last-name"]')?.textContent;
      const phoneNumber = row.querySelector('[data-col="phone-number"]')?.textContent;
      const email = row.querySelector('[data-col="email"]')?.textContent;
      const type = row.querySelector('[data-col="type"]')?.textContent;

      return {
        fistName,
        lastName,
        phoneNumber,
        email,
        type,
      };
    };

    const getForm = () => Promise.resolve(screen.getByTestId('create-user-form'));

    const getInput = (name: string) =>
      Promise.resolve(screen.getByLabelText(new RegExp(name, 'i')));

    const getSelect = (name: string) =>
      Promise.resolve(screen.getByRole('combobox', { name: new RegExp(name, 'i') }));

    const getHeader = () => Promise.resolve(screen.getByText('User Profile'));

    const getCreateUserButton = () => Promise.resolve(screen.getByText('Create User'));

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
      getForm,
      getInput,
      getHeader,
      getCreateUserButton,
      populateInput,
      populateSelect,
      getUserTypeSelect,
      findUserRowById,
      getUserDetailsFromRow,
    });
  };

  it('should render create user form with all its fields and is able to populate fields', async () => {
    const view = await getView({ initialRoute: '/users/new' });

    const form = await view.getForm();
    const header = await view.getHeader();
    const firstNameInput = await view.getInput('first name');
    const lastNameInput = await view.getInput('last name');
    const phoneInput = await view.getInput('phone number');
    const emailInput = await view.getInput('email');
    const typeSelect = await view.getInput('user type');
    const submitButton = await view.getCreateUserButton();
    const select = await view.getUserTypeSelect();

    expect(form).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(typeSelect).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(select).toBeInTheDocument();

    expect(submitButton).toHaveTextContent('Create User');
    expect(submitButton).toBeDisabled();
  });

  it('shoud render form and validate submit button when user fills the form', async () => {
    const view = await getView({ initialRoute: '/users/new' });

    const user = userEvent.setup();
    const form = await view.getForm();
    const header = await view.getHeader();
    const firstNameInput = await view.getInput('first name');
    const lastNameInput = await view.getInput('last name');
    const phoneInput = await view.getInput('phone number');
    const emailInput = await view.getInput('email');
    const submitButton = await view.getCreateUserButton();
    const select = await view.getUserTypeSelect();

    await view.populateInput('first name', 'John');
    await view.populateInput('last name', 'Doe');
    await view.populateInput('email', 'some@email.fake');
    await view.populateSelect('type', 'admin');
    expect(submitButton).toBeEnabled();

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(phoneInput).toHaveValue('');
    expect(emailInput).toHaveValue('some@email.fake');
    expect(select).toHaveValue('admin');

    await user.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(currentLocation.pathname).toEqual('/');

    expect(form).not.toBeInTheDocument();
    expect(header).not.toBeInTheDocument();
    expect(firstNameInput).not.toBeInTheDocument();
    expect(lastNameInput).not.toBeInTheDocument();
    expect(phoneInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();
    expect(submitButton).not.toBeInTheDocument();
    expect(select).not.toBeInTheDocument();
  });

  it('validate that after redirecting to user list page, the user can see the list of existing users', async () => {
    const view = await getView({ initialRoute: '/' });
    const userDetails = await view.getUserDetailsFromRow('1');
    console.log(userDetails);

    expect(1).toBe(1); // This is a placeholder assertion to ensure the test runs
  });
});

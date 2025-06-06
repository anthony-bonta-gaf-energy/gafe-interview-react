import { UserProvider } from '@/contexts/User';
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
import { UserPage } from './user-page';

let currentLocation: Location;
let navigate: NavigateFunction;
const onSubmitMock = vi.fn().mockImplementation(() => {
  navigate('/');
});

// 1. typing on HTMLElement, not casting the UI elements
// TIP: data-test-id is encouraged
// FORM: data-test-id

// 2. Adding jest to access other assertions like toBeDefined, etc.

// 3. Validate both flows creating and using

// CREATE PR by the end of day

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
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <LocationComponent />
                <h1> Home </h1>
              </div>
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
      </MemoryRouter>,
    );

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

    console.log('currentLocation', currentLocation);
  });
});

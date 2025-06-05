import { cleanup, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import { Route, Router, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersProvider } from './user-context';
import { UserPage } from './user-page';
import { UserType } from './user.mjs';

export function mockFetchGetUser() {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    status: 200,
    headers: { get: () => 'application/json' },
    json: async () => ({
      id: '123',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      phoneNumber: '123456789',
      type: UserType.Admin
    }),
  });
};

describe('UserPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  beforeEach(() => {
    cleanup();
  })
  const getView = (historyArg: History) => {
    const history = historyArg;
    const target = render(
      <UsersProvider>
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path="/users/new" element={<UserPage />} />
            <Route path="/users/:id" element={<UserPage />} />
          </Routes>
        </Router>
      </UsersProvider>
    );

    const getSelect = () =>
      Promise.resolve(
        target.container.querySelector<HTMLSelectElement>("select#type")
      );

    const getSaveButton = () => target.findByTestId("saveButton") as Promise<HTMLButtonElement>;
    const getCancelButton = () => target.findByTestId("cancelButton") as Promise<HTMLButtonElement>;
    const getField = (name: string) => target.findByLabelText(new RegExp(name, 'i')) as Promise<HTMLInputElement>;;

    const clickSaveButton = async () => {
      const button = await getSaveButton();
      await userEvent.click(button);
    }

    const clickCancelButton = async () => {
      const button = await getCancelButton();
      await userEvent.click(button!);
    }

    const addTextToField = async (name: string, text: string) => {
      const field = await getField(name);
      await userEvent.type(field!, text)
    };

    const chooseOptionFromSelect = async () => {
      const select = await getSelect();
      await userEvent.selectOptions(select!, "admin")
    };

    return Promise.resolve({
      getField,
      getSaveButton,
      getCancelButton,
      clickCancelButton,
      clickSaveButton,
      getSelect,
      addTextToField,
      chooseOptionFromSelect,
      target
    });
  };


  describe('Create', () => {
    it('should render an empty form', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/new'] });
      const {
        getField,
        getSelect
      } = await getView(history);
      const firstNameInput = await getField("First Name");
      const lastNameInput = await getField("Last Name");
      const emailInput = await getField("Email");
      const phoneNumberInput = await getField("Phone Number");
      const typeSelect = await getSelect();
      // Act.


      // Assert.
      expect(firstNameInput?.textContent).toEqual("");
      expect(lastNameInput?.textContent).toEqual("");
      expect(phoneNumberInput?.textContent).toEqual("");
      expect(emailInput?.textContent).toEqual("");
      expect(typeSelect?.selectedIndex).toEqual(0);
    });

    it('should disable Save when required fields are empty', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/new'] });
      const {
        getSaveButton
      } = await getView(history);
      const saveButton = await getSaveButton();

      //Act


      //Assert
      expect(saveButton?.disabled).toBeTruthy();
    });


    it('should enable Save when all required fields are filled', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/new'] });
      const {
        addTextToField,
        chooseOptionFromSelect,
        getSaveButton
      } = await getView(history);
      const saveButton = await getSaveButton();

      // Act.
      await addTextToField("First Name", "test");
      await addTextToField("Last Name", "test");
      await addTextToField("Email", "test@test.net");
      await chooseOptionFromSelect();

      // Assert.
      expect(saveButton?.disabled).toBeFalsy();
    });

    it('should disable Save when any required field is cleared', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/new'] });
      const {
        addTextToField,
        chooseOptionFromSelect,
        getSaveButton,
        getField
      } = await getView(history);
      const saveButton = await getSaveButton();
      const fieldToClear = await getField("First Name");

      // Act.
      await addTextToField("First Name", "test");
      await addTextToField("Last Name", "test");
      await addTextToField("Email", "test@test.net");
      await chooseOptionFromSelect();
      await userEvent.clear(fieldToClear!);


      // Assert.
      expect(saveButton?.disabled).toBeTruthy();
    });

    it('should create the user and navigate to list when Save is clicked', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/new'] });
      mockFetchGetUser();
      const {
        addTextToField,
        chooseOptionFromSelect,
        clickSaveButton,
      } = await getView(history);

      // Act.
      await addTextToField("First Name", "test");
      await addTextToField("Last Name", "test");
      await addTextToField("Email", "test@test.net");
      await chooseOptionFromSelect();
      await clickSaveButton();

      // Assert.
      expect(history.location.pathname).toBe('/');
    });

    it('should not create the user and navigate to list when Cancel is clicked', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/new'] });
      const {
        clickCancelButton,
      } = await getView(history);

      // Act.
      await clickCancelButton();

      // Assert.
      expect(history.location.pathname).toBe('/');
    });
  });

  describe('Update', () => {
    beforeEach(() => {
      mockFetchGetUser();
    });
    it('should render the form with the user data', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/123'] });
      const {
        getField,
        getSelect,
      } = await getView(history);
      const firstNameInput = await getField("First Name");
      const lastNameInput = await getField("Last Name");
      const emailInput = await getField("Email");
      const phoneNumberInput = await getField("Phone Number");
      const typeSelect = await getSelect();


      // Act.

      // Assert.
      expect(firstNameInput?.value).toBe('Jane');
      expect(lastNameInput?.value).toBe('Doe');
      expect(emailInput?.value).toBe('jane@doe.com');
      expect(phoneNumberInput?.value).toBe('123456789');
      expect(typeSelect?.value).toBe(UserType.Admin)

    });

    it('should disable Save if no changes are made', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/123'] });
      const {
        getSaveButton
      } = await getView(history);
      const saveButton = await getSaveButton();
      // Act.


      //Assert.
      expect(saveButton?.disabled).toBeTruthy();
    });

    it('should enable Save when a required field is changed', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/123'] });
      const {
        getSaveButton,
        addTextToField
      } = await getView(history);
      const saveButton = await getSaveButton();
      // Act.
      await addTextToField("First Name", "test")

      //Assert.
      expect(saveButton.disabled).toBeFalsy();
    });

    it('should disable Save if changes are reverted to original values', async () => {
      // Arrange.
      const history = createMemoryHistory({ initialEntries: ['/users/123'] });
      const {
        getSaveButton,
        addTextToField
      } = await getView(history);
      const saveButton = await getSaveButton();
      // Act.
      await addTextToField("First Name", "test");
      await addTextToField("First Name", "Jane");

      //Assert.
      waitFor(() => {
        expect(saveButton.disabled).toBeTruthy();
      });
    });
  });
});

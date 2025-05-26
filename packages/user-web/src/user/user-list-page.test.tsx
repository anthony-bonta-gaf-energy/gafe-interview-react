import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { History, createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { describe, expect, it } from 'vitest';
import { UserListPage } from './user-list-page';

interface GetViewArgs {
  history: History;
}
describe('User List Page', () => {
  const getView = (args?: GetViewArgs) => {
    const $args = { history: createMemoryHistory(), ...args };

    const target = render(
      <Router location={$args.history.location} navigator={$args.history}>
        <UserListPage />
      </Router>,
    );

    const getCell = (row: string, col: string) =>
      target.container.querySelector<HTMLTableCellElement>(
        `table tr[data-row="${row}"] td[data-col="${col}"]`,
      );

    const getEditButton = async (id: string) => {
      await waitFor(() => {
        expect(
          target.container.querySelector<HTMLButtonElement>(
            `table tr[data-row="${id}"] td[data-col="actions"] button`,
          ),
        ).toBeTruthy();
      });

      return target.container.querySelector<HTMLButtonElement>(
        `table tr[data-row="${id}"] td[data-col="actions"] button`,
      );
    };

    const clickEditButton = async (id: string) => {
      const button = await getEditButton(id);
      await userEvent.click(button!);
    };

    const getCreateUserButton = () => screen.findByText<HTMLButtonElement>('Create New User');

    const clickCreateButton = async () => {
      const button = await getCreateUserButton();
      await userEvent.click(button);
    };

    return Promise.resolve({
      getCell,
      getEditButton,
      clickEditButton,
      getCreateUserButton,
      clickCreateButton,
    });
  };

  it('navigates to /users/new when the create button is clicked', async () => {
    const history = createMemoryHistory();
    const view = await getView({ history });

    await view.clickCreateButton();

    expect(history.location.pathname).toEqual('/users/new');
  });

  it('navigates to /users/:id when the edit button is clicked', async () => {
    const targetId = 'ff899ea1-5397-42b4-996d-f52492e8c835';
    const history = createMemoryHistory();
    const view = await getView({ history });

    await view.clickEditButton(targetId);

    expect(history.location.pathname).toEqual(`/users/${targetId}`);
  });
});

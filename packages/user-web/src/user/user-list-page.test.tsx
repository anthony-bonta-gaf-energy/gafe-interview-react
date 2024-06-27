import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { History, createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { describe, expect, it } from 'vitest';
import { UserListPage } from './user-list-page';

interface GetViewArgs {
  history: History;
}
describe('User List Page', () => {
  const getView = (args?: GetViewArgs) => {
    const $args = {
      history: createMemoryHistory(),
      ...args,
    };

    const target = render(
      <Router location={$args.history.location} navigator={$args.history}>
        <UserListPage />
      </Router>,
    );

    const getCell = (row: string, col: string) =>
      Promise.resolve(
        target.container.querySelector<HTMLTableCellElement>(
          `table tr[data-row="${row}"] td[data-col="${col}"]`,
        ),
      );

    const getEditButton = async (id: string) => {
      const cell = await getCell(id, 'actions');
      return cell?.querySelector<HTMLButtonElement>('button');
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
      getCreateUserButton,
      clickCreateButton,
      getEditButton,
      clickEditButton,
    });
  };

  it('should navigate to the create user page when the create button is clicked', async () => {
    // Arrange.
    const history = createMemoryHistory();
    const view = await getView({ history });

    // Act.
    await view.clickCreateButton();
    const actual = history.location.pathname;

    // Assert.
    expect(actual).toEqual('/users/new');
  });

  it('should navigate to the edit user page when the edit button is clicked', async () => {
    // Arrange.
    const target = 'ff899ea1-5397-42b4-996d-f52492e8c835';
    const history = createMemoryHistory();
    const view = await getView({ history });

    // Act
    await view.clickEditButton(target);
    const actual = history.location.pathname;

    // Assert.
    expect(actual).toEqual(`/users/${target}`);
  });
});

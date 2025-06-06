import { render } from '@testing-library/react';
import { MemoryHistory, createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { UserApp } from './user-app';

interface GetViewArgs {
  history?: MemoryHistory;
}

describe('UserApp', () => {
  const getView = (args?: GetViewArgs) => {
    const $args = {
      history: createMemoryHistory(),
      ...args,
    };

    const target = render(
      <Router location={$args.history.location} navigator={$args.history}>
        <UserApp />
      </Router>,
    );

    const getApp = () =>
      Promise.resolve(target.container.querySelector<HTMLElement>('.gafe-user-app'));

    return Promise.resolve({ getApp });
  };

  it('should render the application', async () => {
    // Arrange.
    const view = await getView();

    // Act.
    const actual = await view.getApp();

    // Assert.
    expect(actual).toBeTruthy();
  });
});

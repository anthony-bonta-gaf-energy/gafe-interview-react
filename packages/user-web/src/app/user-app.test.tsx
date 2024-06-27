import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UserApp } from './user-app';

describe('UserApp', () => {
  const getView = () => {
    const target = render(<UserApp />);

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

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from './form-field.js';

interface GetViewArgs {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
}

describe('FormField', () => {
  const getView = async ({ htmlFor, label, children }: GetViewArgs) => {
    render(
      <FormField htmlFor={htmlFor} label={label}>
        {children}
      </FormField>,
    );

    const getLabel = (label: RegExp): Promise<HTMLLabelElement> => {
      return Promise.resolve(screen.getByText(label));
    };

    const getInput = (label: RegExp): Promise<HTMLInputElement> => {
      return Promise.resolve(screen.getByLabelText(label));
    };

    return Promise.resolve({
      getLabel,
      getInput,
    });
  };

  it('should render label and associate it with input', async () => {
    // Arrange
    const view = await getView({
      htmlFor: 'firstName',
      label: 'First Name',
      children: <input id="firstName" />,
    });

    // Act
    const label = await view.getLabel(/First Name/i);
    const input = await view.getInput(/First Name/i);

    // Assert
    expect(label).not.toBeNull();
    expect(input).not.toBeNull();
  });

  it('should associate the correct input via htmlFor', async () => {
    // Arrange
    const view = await getView({
      htmlFor: 'firstName',
      label: 'First Name',
      children: <input id="firstName" name="firstName" type="text" />,
    });

    // Act
    const label = await view.getLabel(/First Name/i);
    const input = await view.getInput(/First Name/i);

    // Assert
    expect(label.getAttribute('for')).toBe('firstName');
    expect(input.getAttribute('id')).toBe('firstName');
    expect(input.getAttribute('name')).toBe('firstName');
  });
});

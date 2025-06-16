import React, { InputHTMLAttributes } from 'react';
import { useFormFieldValidation } from '../../../hooks/useFormFieldValidation.js';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  required?: boolean;
  key?: string;
}

export const FormInput = ({ name, label, required = false, key, ...props }: FormInputProps) => {
  const { ref, onChange } = useFormFieldValidation<HTMLInputElement>({
    name,
    required,
    getValidationValue: el => el.value.trim() !== '',
  });
  return (
    <React.Fragment key={key || `${name}-${label}`}>
      <label htmlFor={name}>{label}</label>
      <input
        type={props.type || 'text'}
        id={name}
        name={name}
        required={required}
        ref={ref}
        onChange={onChange}
        {...props}
      />
    </React.Fragment>
  );
};

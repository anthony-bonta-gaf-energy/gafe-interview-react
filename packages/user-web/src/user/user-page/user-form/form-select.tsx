import React, { SelectHTMLAttributes } from 'react';
import { useFormFieldValidation } from '../../../hooks/useFormFieldValidation.js';
import { UserTypeSelect } from '../../user.mjs';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  key?: string;
}

export const FormSelect = ({
  name,
  label,
  required = false,
  children,
  key,
  ...props
}: FormSelectProps) => {
  const { ref, onChange } = useFormFieldValidation<HTMLSelectElement>({
    name,
    required,
    getValidationValue: el => el.value.trim() !== '' && el.value !== UserTypeSelect.Empty,
  });
  return (
    <React.Fragment key={key || `${name}-${label}`}>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} required={required} ref={ref} onChange={onChange} {...props}>
        {children}
      </select>
    </React.Fragment>
  );
};

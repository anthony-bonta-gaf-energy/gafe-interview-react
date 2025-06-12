import React, { SelectHTMLAttributes } from 'react';

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
  return (
    <React.Fragment key={key || `${name}-${label}`}>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} required={required} {...props}>
        {children}
      </select>
    </React.Fragment>
  );
};

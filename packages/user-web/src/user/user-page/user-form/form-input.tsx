import React, { InputHTMLAttributes } from 'react';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  required?: boolean;
  key?: string;
}

export const FormInput = ({ name, label, required = false, key, ...props }: FormInputProps) => {
  return (
    <React.Fragment key={key || `${name}-${label}`}>
      <label htmlFor={name}>{label}</label>
      <input type={props.type || 'text'} id={name} name={name} required={required} {...props} />
    </React.Fragment>
  );
};

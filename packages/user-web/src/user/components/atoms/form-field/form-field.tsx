import { FC, ReactNode } from 'react';

interface FormFieldProps {
  htmlFor: string;
  label: string;
  className?: string;
  children: ReactNode;
}

export const FormField: FC<FormFieldProps> = ({
  htmlFor,
  label,
  className = 'form-field',
  children,
}) => {
  return (
    <div className={className}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
};

FormField.displayName = 'FormField';

import { type CSSProperties, type PropsWithChildren, type SelectHTMLAttributes, FC } from 'react';

interface BaseSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}
interface SelectProps extends PropsWithChildren<BaseSelectProps> {
  label?: string;
  required?: boolean;
}

const SELECT_ICON_STYLE: CSSProperties = {
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.5rem center',
  backgroundSize: '1.5em 1.5em',
};

export const Select: FC<SelectProps> = ({
  children = null,
  label = '',
  required = false,
  className = '',
  ...props
}) => {
  const { id, name, disabled } = props;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          required={required}
          className={`block w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            disabled ? 'opacity-60 cursor-not-allowed' : ''
          } ${className}`}
          style={SELECT_ICON_STYLE}
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
};

import React, { ButtonHTMLAttributes } from 'react';

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'red' | 'green' | 'blue';
  size?: 'small' | 'medium' | 'large';
}

interface ButtonPropsWithChildren extends BaseButtonProps {
  children: React.ReactNode;
  text?: never;
}

interface ButtonPropsNoChildren extends BaseButtonProps {
  children?: never;
  text?: string;
}

type ButtonProps = ButtonPropsWithChildren | ButtonPropsNoChildren;

const BUTTON_COLOR_MAP: Record<string, string> = {
  red: 'bg-red-500 hover:bg-red-700 text-white',
  green: 'bg-green-500 hover:bg-green-700 text-white',
  blue: 'bg-blue-500 hover:bg-blue-700 text-white',
};

const DEFAULT_BUTTON_COLOR = 'bg-slate-500 hover:bg-blue-700 text-white'; // Default color if none is provided

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  text = '',
  color = '',
  children = null,
}) => {
  const buttonColor = BUTTON_COLOR_MAP[color] || DEFAULT_BUTTON_COLOR; // Default color
  return (
    <button
      type={type}
      className={`text-white font-medium py-2 px-4 cursor-pointer rounded focus:outline-none focus:shadow-outline ${buttonColor} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text || children}
    </button>
  );
};

export default Button;

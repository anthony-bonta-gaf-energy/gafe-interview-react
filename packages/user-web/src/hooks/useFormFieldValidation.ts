import { useCallback, useEffect, useRef } from 'react';
import { useFormValidation } from '../context/form-context.js';

interface UseFormFieldValidationResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  onChange: (event: React.ChangeEvent<T>) => void;
}

interface useFormFieldValidationProps<T extends HTMLElement> {
  name: string;
  required: boolean;
  getValidationValue: (el: T) => boolean;
}

export const useFormFieldValidation = <T extends HTMLElement>({
  name,
  required,
  getValidationValue,
}: useFormFieldValidationProps<T>): UseFormFieldValidationResult<T> => {
  const { registerRequiredInput } = useFormValidation();
  const fieldRef = useRef<T>(null);

  const handleChange = useCallback((event: React.ChangeEvent<T>) => {
    if (required && fieldRef.current) {
      registerRequiredInput(name, getValidationValue(fieldRef.current));
    }
  }, []);

  useEffect(() => {
    if (required && fieldRef.current) {
      registerRequiredInput(name, getValidationValue(fieldRef.current));
    }
  }, [fieldRef.current]);

  return { ref: fieldRef, onChange: handleChange };
};

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface FormValidationContextType {
  registerRequiredInput: (name: string, isValid: boolean) => void;
  isFormValid: boolean;
}

interface FormProviderProps {
  children: ReactNode;
}

const FormValidationContext = createContext<FormValidationContextType | null>(null);

export const FormProvider = ({ children }: FormProviderProps) => {
  const [requiredInputsValidity, setRequiredInputsValidity] = useState<Map<string, boolean>>(
    new Map(),
  );

  const registerRequiredInput = useCallback((name: string, isValid: boolean) => {
    setRequiredInputsValidity(prev => new Map([...prev, [name, isValid]]));
  }, []);

  const isFormValid = useMemo(() => {
    if (requiredInputsValidity.size === 0) {
      return true;
    }

    return Array.from(requiredInputsValidity.values()).every(isValid => isValid);
  }, [requiredInputsValidity]);

  const value = useMemo(
    () => ({
      registerRequiredInput,
      isFormValid,
    }),
    [registerRequiredInput, isFormValid],
  );

  return <FormValidationContext.Provider value={value}>{children}</FormValidationContext.Provider>;
};

// Custom hook to consume the context.
export const useFormValidation = (): FormValidationContextType => {
  const context = useContext(FormValidationContext);
  if (context === null) {
    throw new Error(
      'useFormValidation must be used within a FormProvider. Make sure your component is wrapped by <FormProvider>.',
    );
  }
  return context;
};

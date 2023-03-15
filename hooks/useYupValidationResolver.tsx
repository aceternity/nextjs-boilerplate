import * as yup from 'yup';
import { useCallback } from 'react';

type FormValues = Record<string, any>;
type FormErrors = Record<string, { type: string; message: string }>;

type ValidationResult = {
  values: FormValues;
  errors: FormErrors;
};

const useYupValidationResolver = <T extends Record<string, any>>(
  validationSchema: yup.ObjectSchema<T>
): ((data: FormValues) => Promise<ValidationResult>) =>
  useCallback(async (data: FormValues) => {
    try {
      const values = await validationSchema.validate(data, {
        abortEarly: false,
      });

      return {
        values,
        errors: {},
      };
    } catch (errors: any) {
      return {
        values: {},
        errors: errors.inner.reduce(
          (allErrors: FormErrors, currentError: any) => ({
            ...allErrors,
            [currentError.path]: {
              type: currentError.type ?? 'validation',
              message: currentError.message,
            },
          }),
          {} as FormErrors
        )
      };
    }
  }, [validationSchema]);

export default useYupValidationResolver;

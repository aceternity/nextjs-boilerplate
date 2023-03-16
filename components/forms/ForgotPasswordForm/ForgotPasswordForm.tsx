import { Button, Input } from '@components/elements';
import Flex from '@components/Flex';
import useYupValidationResolver from '@hooks/useYupValidationResolver';
import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import Link from 'next/link';

export type ForgotPasswordFormValues = {
  email: string;
};

interface ForgotPasswordProps {
  loading?: boolean;
  onSubmit: (updatedValues: ForgotPasswordFormValues) => void;
}

const validationSchema: yup.ObjectSchema<ForgotPasswordFormValues> = yup.object({
  email: yup.string().required("Required"),
});


const ForgotPassword: React.FC<ForgotPasswordProps> = (props: ForgotPasswordProps) => {

  const resolver = useYupValidationResolver(validationSchema);
  const { loading, onSubmit } = props;

  const methods = useForm<ForgotPasswordFormValues>({
    defaultValues: {
    },
    resolver
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot password ?
          </h1>
          <div>
            <Controller
              control={methods.control}
              name="email"
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <Input
                  type="text"
                  placeholder="Enter email"
                  size="md"
                  label="Email"
                  value={value}
                  onChange={onChange}
                  disabled={loading}
                  error={error?.message}
                />
              )}
            />
          </div>
          <Button classes="w-full" type="submit" disabled={loading}>Forgot password</Button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet? <Link href={'/auth/register'}><button disabled={loading} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</button></Link>
          </p>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Have an account? <Link href={'/auth/login'}><button disabled={loading} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</button></Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

ForgotPassword.defaultProps = {

};

ForgotPassword.propTypes = {

};

export default ForgotPassword;

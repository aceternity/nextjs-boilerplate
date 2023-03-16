import { Button, Input } from '@components/elements';
import Flex from '@components/Flex';
import useYupValidationResolver from '@hooks/useYupValidationResolver';
import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import Link from 'next/link';
import { AuthDivider, SocialAuth } from '../LoginForm/LoginForm';

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

interface RegisterFormProps {
  loading?: boolean;
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null,
  onSubmit: (updatedValues: RegisterFormValues, formInstance: UseFormReturn<RegisterFormValues, any>) => void;
}

const validationSchema: yup.ObjectSchema<RegisterFormValues> = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().required("Required"),
  password: yup.string().required("Required"),
});


const RegisterForm: React.FC<RegisterFormProps> = (props: RegisterFormProps) => {

  const resolver = useYupValidationResolver(validationSchema);
  const { loading, onSubmit, providers } = props;

  const methods = useForm<RegisterFormValues>({
    defaultValues: {
    },
    resolver
  });

  const handleSubmit = (values: RegisterFormValues) => {
    methods
    onSubmit(values, methods)
  }

  return (
    <>
    <SocialAuth providers={providers} loading={loading} />
    <AuthDivider />
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create your account
          </h1>
          <div>
            <Controller
              control={methods.control}
              name="name"
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <Input
                  type="text"
                  placeholder="Enter name"
                  size="md"
                  label="Name"
                  value={value}
                  onChange={onChange}
                  disabled={loading}
                  error={error?.message}
                />
              )}
            />
          </div>
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
          <div>
            <Controller
              control={methods.control}
              name="password"
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <Input
                  type="password"
                  placeholder="Enter password"
                  size="md"
                  label="Password"
                  value={value}
                  onChange={onChange}
                  disabled={loading}
                  error={error?.message}
                />
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <Link href={'/auth/forgot'}>
              <button className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500" disabled={loading}>Forgot password?</button>
            </Link>
          </div>
          <Button classes="w-full" type="submit" disabled={loading}>Sign up</Button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Have an account? <Link href={'/auth/login'}><button disabled={loading} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</button></Link>
          </p>
        </div>
      </form>
    </FormProvider>
    </>
  );
};

RegisterForm.defaultProps = {

};

RegisterForm.propTypes = {

};

export default RegisterForm;

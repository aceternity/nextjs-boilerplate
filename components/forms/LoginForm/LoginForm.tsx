import { Button, Input } from '@components/elements';
import Flex from '@components/Flex';
import useYupValidationResolver from '@hooks/useYupValidationResolver';
import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { getProviders, getCsrfToken, useSession, LiteralUnion, ClientSafeProvider, signIn } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';

export type LoginFormValues = {
  username: string;
  password: string;
};

interface LoginFormProps {
  loading?: boolean;
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null,
  onSubmit: (updatedValues: LoginFormValues) => void;
}

const validationSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
  username: yup.string().required("Required"),
  password: yup.string().required("Required"),
});


const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {

  const resolver = useYupValidationResolver(validationSchema);
  const { loading, onSubmit } = props;

  const methods = useForm<LoginFormValues>({
    defaultValues: {
    },
    resolver
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <div>
                  <Controller
                    control={methods.control}
                    name="username"
                    render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                    <Input 
                      type="text" 
                      placeholder="Enter username"
                      size="md"
                      label="Username"
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
                    render={({ field: { onChange, onBlur, value, ref }, fieldState: { error }  }) => (
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
                  <button className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"  disabled={loading}>Forgot password?</button>
                </div>
                <Button classes="w-full" type="submit" disabled={loading}>Sign in</Button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <button disabled={loading} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</button>
                </p>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </section>
  );
};

LoginForm.defaultProps = {

};

LoginForm.propTypes = {

};

export default LoginForm;

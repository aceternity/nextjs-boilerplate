import { Button, Input } from '@components/elements';
import Flex from '@components/Flex';
import useYupValidationResolver from '@hooks/useYupValidationResolver';
import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { LiteralUnion, ClientSafeProvider, signIn } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import Link from 'next/link';

import { FcGoogle } from 'react-icons/fc';
import { VscGithub } from 'react-icons/vsc';
import classNames from 'classnames';

export const AuthDivider = () => {
  return (
    <div className="inline-flex items-center justify-center w-full">
      <hr className="w-64 h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
    </div>
  )
}
interface SocialAuthProps {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null,
  loading: boolean | undefined;
}
export const SocialAuth = ({ providers, loading }: SocialAuthProps) => {

  const buttonCommonClasses = "w-full rounded-md justify-center font-medium py-2 border px-4 flex items-center gap-2";

  return (
    <div className='flex px-2 flex-col max-w-md md:flex-row mx-auto gap-2 py-2 justify-center items-center text-center'>
    {providers && Object.keys(providers).map((providerKey) => {
        if (providers[providerKey].type === 'oauth') {
          switch(providers[providerKey].id) {
            case 'google':
              return (
              <button 
                disabled={loading}
                onClick={() => signIn(providers[providerKey].id)}
                className={classNames(
                  buttonCommonClasses,
                  "text-primary-600 hover:underline dark:text-primary-500"
                  )}>
                  <FcGoogle />
                  Sign in with {providers[providerKey].id}
              </button>
              );
              case 'github':
                return (
                <button 
                  disabled={loading} 
                  onClick={() => signIn(providers[providerKey].id)}
                  className={classNames(
                    buttonCommonClasses, 
                    "text-secondary-600 hover:underline dark:text-secondary-500"
                  )}>
                    <VscGithub />
                    Sign in with {providers[providerKey].id}
                </button>
                );
          }
        }
        return null;
      })}
    </div>
  );
}

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
  const { loading, onSubmit, providers } = props;

  const methods = useForm<LoginFormValues>({
    defaultValues: {
    },
    resolver
  });

  
  return (
    <>
    <SocialAuth providers={providers} loading={loading} />
    <AuthDivider />
    {providers && providers?.credentials && (
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
            <Button classes="w-full" type="submit" disabled={loading}>Sign in</Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet? <Link href={'/auth/register'}><button disabled={loading} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</button></Link>
            </p>
          </div>
        </form>
      </FormProvider>
      )}
    </>
  );
};

LoginForm.defaultProps = {

};

LoginForm.propTypes = {

};

export default LoginForm;

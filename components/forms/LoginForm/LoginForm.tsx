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
import { BsFacebook, BsTwitter } from 'react-icons/bs';

import classNames from 'classnames';
import { useRouter } from 'next/router';

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
  redirect?: string;
}
export const SocialAuth = ({ providers, loading, redirect }: SocialAuthProps) => {

  const signInHandler = (id: LiteralUnion<BuiltInProviderType, string>) => {
    signIn(id, { redirect: true, callbackUrl: redirect || '/dashboard' })
  }

  const buttonCommonClasses = "w-full text-sm rounded-md justify-center font-medium py-2 border px-4 flex items-center gap-2 text-secondary-600 hover:underline dark:text-secondary-500";

  const commonString = 'Login with ';
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 px-2 flex-col max-w-md md:flex-row mx-auto gap-2 py-2 justify-center items-center text-center'>
    {providers && Object.keys(providers).map((providerKey) => {
        if (providers[providerKey].type === 'oauth') {
          switch(providers[providerKey].id) {
            case 'google':
              return (
              <button 
                key={providers[providerKey].id}
                disabled={loading}
                onClick={() => signInHandler(providers[providerKey].id)}
                className={classNames(
                  buttonCommonClasses,
                  )}>
                  <FcGoogle />
                  {commonString}{providers[providerKey].id}
              </button>
              );
            case 'github':
              return (
              <button 
                key={providers[providerKey].id}
                disabled={loading} 
                onClick={() => signInHandler(providers[providerKey].id)}
                className={classNames(
                  buttonCommonClasses, 
                )}>
                  <VscGithub />
                  {commonString}{providers[providerKey].id}
              </button>
              );
            case 'twitter':
              return (
              <button 
                key={providers[providerKey].id}
                disabled={loading} 
                onClick={() => signInHandler(providers[providerKey].id)}
                className={classNames(
                  buttonCommonClasses, 
                )}>
                  <BsTwitter />
                  {commonString}{providers[providerKey].id}
              </button>
              );
            case 'facebook':
              return (
              <button 
                key={providers[providerKey].id}
                disabled={loading} 
                onClick={() => signInHandler(providers[providerKey].id)}
                className={classNames(
                  buttonCommonClasses, 
                )}>
                  <BsFacebook />
                  {commonString}{providers[providerKey].id}
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
  onSubmit: (updatedValues: LoginFormValues, redirect?: string) => void;
}

const validationSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
  username: yup.string().required("Required"),
  password: yup.string().required("Required"),
});


const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const router = useRouter();
  const { redirect } = router.query;
  const defaultRedirect = redirect as string || '/dashboard';

  const resolver = useYupValidationResolver(validationSchema);
  const { loading, onSubmit, providers } = props;

  const methods = useForm<LoginFormValues>({
    defaultValues: {
    },
    resolver
  });

  const onSubmitHandler = (values: LoginFormValues) => { 
    onSubmit(values, defaultRedirect);
  } 
  
  return (
    <>
    <SocialAuth redirect={defaultRedirect} providers={providers} loading={loading} />
    <AuthDivider />
    {providers && providers?.credentials && (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
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
              Don’t have an account yet? 
              <Link 
                href={`/auth/register${redirect as string ? `?redirect=${redirect as string}`: ''}`}
              >
                <button disabled={loading} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</button>
              </Link>
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

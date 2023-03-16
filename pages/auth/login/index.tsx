import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { AuthLayout } from '@components/index';
import { LoginForm } from '@components/forms';
import { ClientSafeProvider, getCsrfToken, getProviders, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useSignIn } from '@hooks/query/currentUser';

type Data = { 
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null,
}

const Login = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { providers } = props;
  const { login, isLoading } = useSignIn();
  return ( 
    <AuthLayout>
        <LoginForm onSubmit={login} loading={isLoading} providers={providers} />
    </AuthLayout>
  )
}

export default Login;


export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  }
}
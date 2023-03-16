import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { AuthLayout } from '@components/index';
import { RegisterForm } from '@components/forms';
import { ClientSafeProvider, getCsrfToken, getProviders, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { useSignup } from '@hooks/query/currentUser';

type Data = { 
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null,
}

const Register = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { providers } = props;
  const { signup, isLoading } = useSignup();
  return ( 
    <AuthLayout>
        <RegisterForm onSubmit={signup} loading={isLoading} providers={providers} />
    </AuthLayout>
  )
}

export default Register;


export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  }
}
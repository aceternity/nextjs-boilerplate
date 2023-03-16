import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { AuthLayout } from '@components/index';
import { ResetPasswordForm } from '@components/forms';
import { useResetPassword } from '@hooks/query/currentUser';
import prisma from '@lib/prisma';

type Data = { 
  token: string;
}

const ResetPasswordPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { token } = props;
  const { updatePassword, isUpdateLoading } = useResetPassword();
  return (
    <AuthLayout>
      <ResetPasswordForm onSubmit={(e) => updatePassword(e, token)} loading={isUpdateLoading} />
    </AuthLayout>
  )
}

export default ResetPasswordPage;


export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const { query } = context;
  if (query && query.token) {
    const { token } = query;
    const _token = Array.isArray(token) ? token[0] : token;
   const tokenFound = await prisma.passwordResetToken.findUnique({ where: { token: _token }});

   if (!tokenFound) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
      props:{},
    };
   }
    return {
      props: { token: _token },
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: "/auth/login",
    },
    props:{},
  };
}
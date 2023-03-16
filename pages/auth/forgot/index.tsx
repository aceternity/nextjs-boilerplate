import React from 'react'
import { NextPage } from 'next';
import { AuthLayout } from '@components/index';
import { ForgotPasswordForm } from '@components/forms';

import { useForgotPassword } from '@hooks/query/currentUser';


const ForgotPassword: NextPage = () => {
  const { forgot, isLoading } = useForgotPassword();
  return ( 
    <AuthLayout>
        <ForgotPasswordForm onSubmit={forgot} loading={isLoading} />
    </AuthLayout>
  )
}

export default ForgotPassword;

import React from 'react'
import { NextPage } from 'next';
import { MainLayout } from '@components/index';
import AccountLayout from '@components/layouts/AccountLayout';
import { ChangePasswordForm } from '@components/forms';
import { useUpdatePassword } from '@hooks/query/currentUser';

const ChangePasswordPage: NextPage = () => {
  const { updatePassword, isUpdateLoading } = useUpdatePassword();
  return (
    <MainLayout>
      <AccountLayout tab="password">
        <ChangePasswordForm onSubmit={updatePassword} loading={isUpdateLoading} />
      </AccountLayout>
    </MainLayout>
  )
}

export default ChangePasswordPage;
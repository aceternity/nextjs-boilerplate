import React from 'react'
import { NextPage } from 'next';
import { MainLayout } from '@components/index';
import AccountLayout from '@components/layouts/AccountLayout';

const ChangePasswordPage: NextPage = () => {
  return (
    <MainLayout>
      <AccountLayout tab="password">
        <div>password</div>
      </AccountLayout>
    </MainLayout>
  )
}

export default ChangePasswordPage;
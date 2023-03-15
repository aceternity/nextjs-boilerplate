import React from 'react'
import { NextPage } from 'next';
import { MainLayout } from '@components/index';
import AccountLayout from '@components/layouts/AccountLayout';

const Profile: NextPage = () => {
  return (
    <MainLayout>
      <AccountLayout tab="profile">
        <div>Profile</div>
      </AccountLayout>
    </MainLayout>
  )
}

export default Profile;
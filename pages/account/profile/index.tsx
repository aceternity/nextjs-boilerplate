import React from 'react'
import { NextPage } from 'next';
import { MainLayout } from '@components/index';
import AccountLayout from '@components/layouts/AccountLayout';
import { ProfileForm } from '@components/forms';
import { useUser } from '@hooks/query/currentUser';

const Profile: NextPage = () => {
  const { updateUser, data, isLoading, isUpdateLoading } = useUser();
  return ( 
    <MainLayout>
      <AccountLayout tab="profile">
        <>
          {isLoading && <>Loading...</>}
          {!isLoading && <ProfileForm onSubmit={updateUser} loading={isUpdateLoading} data={data} />}
        </>
      </AccountLayout>
    </MainLayout>
  )
}

export default Profile;
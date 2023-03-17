import React from 'react'
import { NextPage } from 'next';
import { CurrentPlanCard, MainLayout } from '@components/index';
import AccountLayout from '@components/layouts/AccountLayout';


const Profile: NextPage = () => {

  
  return ( 
    <MainLayout>
      <AccountLayout tab="billing">
        <CurrentPlanCard />
      </AccountLayout>
    </MainLayout>
  )
}

export default Profile;
import React from 'react'

import { MainLayout } from '@components/index';
import { NextPageWithProps } from '@pages/_app';

const Dashboard: NextPageWithProps = () => {
  return (
    <MainLayout>
      
    </MainLayout>
  )
}

Dashboard.requireAuth = true;
export default Dashboard;

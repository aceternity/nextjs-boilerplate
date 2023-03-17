import React from 'react';

import { CurrentPlanCard, MainLayout } from '@components/index';
import { NextPageWithProps } from '@pages/_app';

const PrcingPage: NextPageWithProps = () => {

  return (
    <MainLayout>
     <CurrentPlanCard />
    </MainLayout>
  )
}

PrcingPage.requireAuth = true;
export default PrcingPage;
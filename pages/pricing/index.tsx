import React from 'react';

import { CurrentPlanCard, MainLayout } from '@components/index';
import { NextPageWithProps } from '@pages/_app';

const PrcingPage: NextPageWithProps = () => {

  return (
    <MainLayout>
     <CurrentPlanCard isCreateOrganization />
    </MainLayout>
  )
}

PrcingPage.requireAuth = true;
export default PrcingPage;
import React from 'react'
import { NextPage } from 'next';

import { CurrentPlanCard, MainLayout } from '@components/index';
import OrganizationLayout from '@components/layouts/OrganizationLayout';

const Billing: NextPage = () => {
  return (
    <MainLayout>
      <OrganizationLayout tab="billing">
        <CurrentPlanCard isOrganization />
      </OrganizationLayout>
    </MainLayout>
  )
}

export default Billing;

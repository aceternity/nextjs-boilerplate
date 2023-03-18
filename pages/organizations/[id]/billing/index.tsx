import React from 'react'
import { NextPage } from 'next';

import { MainLayout, PricingComponent } from '@components/index';
import OrganizationLayout from '@components/layouts/OrganizationLayout';

const Billing: NextPage = () => {
  return (
    <MainLayout>
      <OrganizationLayout tab="billing">
        <PricingComponent isOrganization />
      </OrganizationLayout>
    </MainLayout>
  )
}

export default Billing;

import React from 'react'
import { NextPage } from 'next';

import { CurrentPlanCard, MainLayout } from '@components/index';
import OrganizationLayout from '@components/layouts/OrganizationLayout';
import { useRouter } from 'next/router';

const Billing: NextPage = () => {
  const router = useRouter();

  const { query } = router;
  return (
    <MainLayout>
      <OrganizationLayout tab="billing">
        <CurrentPlanCard organizationId={query.organizationId as string} />
      </OrganizationLayout>
    </MainLayout>
  )
}

export default Billing;

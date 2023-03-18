import React from 'react'
import { useRouter } from 'next/router';


import { Flex, MainLayout } from '@components/index';
import { NextPageWithProps } from '@pages/_app';
import { SUBSCRIPTION_PLAN } from '@lib/payments/constants'; 
import OrganizationLayout from '@components/layouts/OrganizationLayout';


const Organization: NextPageWithProps = () => {

  return (
    <MainLayout>
      <Flex direction='col' gap="4">
        <OrganizationLayout tab="dashboard">
          <Flex gap='2' direction="col">
            Build something here
          </Flex>
        </OrganizationLayout>
      </Flex>
    </MainLayout>
  )
}

Organization.requireAuth = true;
Organization.requireSubscription = true;
Organization.plans = [SUBSCRIPTION_PLAN.team];

export default Organization;

import React from 'react'

import { DialogComponent, Flex, MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import { NextPageWithProps } from '@pages/_app';

import { SUBSCRIPTION_PLAN } from '@lib/payments/constants';
import { OrganizationForm } from '@components/forms';
import { useCreateOrganization, useOrganzations } from '@hooks/query/organizations';
import { OrganizationData } from '@pages/api/organizations';

const Organizations: NextPageWithProps = () => {
  const { data } = useOrganzations();
  const { createOrganization, isLoading: createLoading } = useCreateOrganization();
  
  const columnHelper = createColumnHelper<OrganizationData>();
  const columns = [
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('membersCount', {
      cell: info => info.getValue(),
    }),
  ];

  return (
    <MainLayout>
      <Flex gap='2' direction="col">
        <div className='flex justify-end'>
          <DialogComponent buttonText="Add new Organization">
              <OrganizationForm onSubmit={createOrganization} loading={createLoading} />
          </DialogComponent>
        </div>
        <Table
          title="Organizations"
          caption=""
          columns={columns}
          data={data?.data}
        />
      </Flex>
    </MainLayout>
  )
}

Organizations.requireAuth = true;
Organizations.requireSubscription = true;
Organizations.plans = [SUBSCRIPTION_PLAN.team];

export default Organizations;

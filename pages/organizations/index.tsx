import React from 'react'

import { DialogComponent, Flex, MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import { NextPageWithProps } from '@pages/_app';

import { SUBSCRIPTION_PLAN } from '@lib/payments/constants';
import { OrganizationForm } from '@components/forms';
import { useCreateOrganization, useOrganizations } from '@hooks/query/organizations';
import { OrganizationData } from '@pages/api/organizations';
import Link from 'next/link';

const Organizations: NextPageWithProps = () => {
  const { data } = useOrganizations();
  const { createOrganization, isLoading: createLoading } = useCreateOrganization();
  
  const columnHelper = createColumnHelper<OrganizationData>();
  const columns = [
    columnHelper.accessor('name', {
      cell: (data) => {
        return (
          <Link href={`/organizations/${data.row.original.id}`}>{data.getValue()}</Link>
        )
      },
    }),
    columnHelper.accessor('_count.invitations', {
      header: () => 'Invitations',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('_count.members', {
      header: () => 'Members',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('subscription.status', {
      header: () => 'Subscription Status',
      cell: info => info.getValue() ? info.getValue(): 'No Plan',
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
Organizations.plans = [SUBSCRIPTION_PLAN.TEAMS];

export default Organizations;

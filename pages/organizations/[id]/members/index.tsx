import React from 'react'
import { NextPage } from 'next';

import { MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import { useUsers } from '@hooks/query/users';
import { UserData } from '@pages/api/users';
import OrganizationLayout from '@components/layouts/OrganizationLayout';

const Users: NextPage = () => {
  const { data } = useUsers();
  
  const columnHelper = createColumnHelper<UserData>();
  const columns = [
    columnHelper.accessor('email', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('role', {
      cell: info => info.getValue().toString(),
    }),
    columnHelper.accessor('emailVerified', {
      header: info => 'Email Verified',
      cell: info => info.getValue(),
    }),
  ];

  return (
    <MainLayout>
      <OrganizationLayout tab="members">
        <Table
          title="Members"
          caption=""
          columns={columns}
          data={data?.data}
        />
      </OrganizationLayout>
    </MainLayout>
  )
}

export default Users;

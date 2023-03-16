import React from 'react'

import { MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import { useUsers } from '@hooks/query/users';
import { UserData } from '@pages/api/users';
import { NextPageWithProps } from '@pages/_app';

const Organizations: NextPageWithProps = () => {
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
      <Table
        title="Organizations"
        caption=""
        columns={columns}
        data={data?.data}
      />
    </MainLayout>
  )
}

Organizations.requireAuth = true;
export default Organizations;

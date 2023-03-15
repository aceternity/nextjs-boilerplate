import React from 'react'
import { NextPage } from 'next';

import { MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import { useUsers } from '@hooks/query/user';
import { UserData } from '@pages/api/users';

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
      <Table
        title="Users"
        caption=""
        columns={columns}
        data={data?.data}
      />
    </MainLayout>
  )
}

export default Users;

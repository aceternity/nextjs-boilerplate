import React from 'react'

import { MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import { useProducts } from '@hooks/query/plans';
import { ProductData } from '@pages/api/products';
import { NextPageWithProps } from '@pages/_app';
import { Role } from '@prisma/client';

const Users: NextPageWithProps = () => {
  const { data } = useProducts();
  
  const columnHelper = createColumnHelper<ProductData>();
  const columns = [
    columnHelper.accessor('id', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('uniqueIdentifier', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('active', {
      cell: info => info.getValue() ? 'ACTIVE': 'INACTIVE',
    }),
  ];

  return (
    <MainLayout>
      <Table
        title="Products"
        caption=""
        columns={columns}
        data={data?.data}
      />
    </MainLayout>
  )
}

Users.requireAuth = true;
Users.roles = [Role.superadmin];
export default Users;

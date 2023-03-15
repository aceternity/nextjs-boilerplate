import React from 'react'
import { NextPage } from 'next';

import { MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import { useProducts } from '@hooks/query/plans';
import { ProductData } from '@pages/api/products';

const Users: NextPage = () => {
  const { data } = useProducts();
  
  const columnHelper = createColumnHelper<ProductData>();
  const columns = [
    columnHelper.accessor('id', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
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

export default Users;

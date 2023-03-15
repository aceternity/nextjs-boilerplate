import React from 'react'
import { NextPage } from 'next';

import { MainLayout, Table } from '@components/index';

const Users: NextPage = () => {
  return (
    <MainLayout>
      <Table
        title="Users"
        caption=""
      />
    </MainLayout>
  )
}

export default Users;

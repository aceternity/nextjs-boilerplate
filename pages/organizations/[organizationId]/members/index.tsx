import React from 'react'
import { NextPage } from 'next';

import { Flex, MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import { useUsers } from '@hooks/query/users';
import { UserData } from '@pages/api/users';
import OrganizationLayout from '@components/layouts/OrganizationLayout';
import { useOrganizationInvitationsMembers, useOrganizationMembers } from '@hooks/query/organizations';
import { useRouter } from 'next/router';
import { OrganizationMemberData } from '@pages/api/organizations/[id]/members';
import { OrganizationInvitationMemberData } from '@pages/api/organizations/[id]/invitations';

const Users: NextPage = () => {
  const router = useRouter();

  const { query } = router;

  const { organizationId } = query;
  const { data } = useOrganizationMembers({ organizationId: organizationId as string  });

  const { data: inivitaionMembers } = useOrganizationInvitationsMembers({ organizationId: organizationId as string  });
  
  const memberColumnHelper = createColumnHelper<OrganizationMemberData>();
  const membersColumns = [
    memberColumnHelper.accessor('user.email', {
      header: () => 'Email',
      cell: info => info.getValue(),
    }),
    memberColumnHelper.accessor('user.name', {
      header: () => 'Name',
      cell: info => info.getValue(),
    }),
    memberColumnHelper.accessor('role', {
      header: () => 'Role',
      cell: info => info.getValue().toString(),
    }),
  ];

  const columnHelper = createColumnHelper<OrganizationInvitationMemberData>();
  const invitationsColumns = [
    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('role', {
      header: () => 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: info => info.getValue(),
    }),
  ];

  return (
    <MainLayout>
      <OrganizationLayout tab="members">
        <Flex direction="col" gap="4">
        <Table
          title="Members"
          caption=""
          columns={membersColumns}
          data={data?.data}
        />

        <Table
          title="Invitations"
          caption=""
          columns={invitationsColumns}
          data={inivitaionMembers?.data}
        />
        </Flex>
      </OrganizationLayout>
    </MainLayout>
  )
}

export default Users;

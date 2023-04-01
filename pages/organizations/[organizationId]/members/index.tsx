import React, { useState } from 'react'
import { NextPage } from 'next';

import { DialogComponent, Flex, MainLayout, Table } from '@components/index';
import { createColumnHelper } from '@tanstack/react-table';
import OrganizationLayout from '@components/layouts/OrganizationLayout';
import { 
  useCancelMemberInvitation,
  useInviteMemberToOrganization,
  useOrganizationInvitationsMembers, 
  useOrganizationMembers,
  useRemoveOrganizationMember,
} from '@hooks/query/organizations';
import { useRouter } from 'next/router';
import { OrganizationMemberData } from '@pages/api/organizations/[id]/members';
import { OrganizationInvitationMemberData } from '@pages/api/organizations/[id]/invitations';

import { OrganizationMemberInviteForm } from '@components/forms';
import { Button } from '@components/elements';
import { OrganizationRole } from '@prisma/client';

const Users: NextPage = () => {
  const router = useRouter();
  const { query } = router;
  const { organizationId } = query;

  const { data } = useOrganizationMembers({ organizationId: organizationId as string  });
  const { data: inivitaionMembers } = useOrganizationInvitationsMembers({ organizationId: organizationId as string  });

  const { invite, isLoading: inviteLoading }  = useInviteMemberToOrganization({ organizationId: organizationId as string });

  const { cancelInvitation, isCancelLoading }  = useCancelMemberInvitation({ organizationId: organizationId as string  });
  
  const memberColumnHelper = createColumnHelper<OrganizationMemberData & { actions?: string }>();
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
    memberColumnHelper.accessor('actions', {
      header: () => 'Actions',
      cell: (data) => {
        const { remove, isLoading } = useRemoveOrganizationMember({ 
          organizationId: organizationId as string,
          memberId: data.row.original.id,
        })
        if ( data.row.original.role !== OrganizationRole.org_admin ) {
          return (
            <Button 
              size="xs" 
              onClick={() => {
                if (confirm('Are you sure you want to remove member?'))
                remove();
              }}
              loading={isLoading}
            >
              {isLoading ? 'Removing...': 'Remove'}
            </Button>
          );
        }
        return <></>;
      },
    }),
  ];

  const columnHelper = createColumnHelper<OrganizationInvitationMemberData & { actions?: string }>();
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
    columnHelper.accessor('actions', {
      header: () => 'Actions',
      cell: (data) => (
        <Button 
          size="xs" 
          loading={isCancelLoading}
          onClick={() => {
            if (confirm('Are you sure you want to cancel invitation?'))
            cancelInvitation({ invitationId: data.row.original.id });
          }}
        >
          Cancel Invitation
        </Button>
      ),
    }),
  ];

  const [inviteForm, setInviteForm] = useState(false);
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

        <Flex gap='2' direction="col">
          <div className='flex justify-end'>
            <DialogComponent
              buttonText="Invite Member"
              onOpenChange={setInviteForm}
              open={inviteForm}
            >
                <OrganizationMemberInviteForm onSubmit={(values, formInstance) => invite(values, formInstance, setInviteForm)} loading={inviteLoading} />
            </DialogComponent>
            </div>
            <Table
              title="Invitations"
              caption=""
              columns={invitationsColumns}
              data={inivitaionMembers?.data}
            />
          </Flex>
        </Flex>
      </OrganizationLayout>
    </MainLayout>
  )
}

export default Users;

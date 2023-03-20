import Menu from '@components/Menu';
import React from 'react';

import { TabItem } from '@components/Tabs/Tab';
import Tabs from '@components/Tabs';
import Link from 'next/link';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';
import Flex from '@components/Flex';
import { OrganizationRole } from '@prisma/client';
import { useOrganizationMember } from '@hooks/query/organizations';

const getOrganizationTabs = (id: string) => {

  const organizationTabs: TabItemWithOrganizationRole[] = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      route: `/organizations/${id}`,
      roles: [OrganizationRole.org_admin, OrganizationRole.org_user]
    },
    {
      key: 'members',
      title: 'Members',
      route: `/organizations/${id}/members`,
      roles: [OrganizationRole.org_admin]
    },
    {
      key: 'billing',
      title: 'Billing',
      route: `/organizations/${id}/billing`,
      roles: [OrganizationRole.org_admin]
    }
  ]

  return organizationTabs;
}


interface OrganizationLayoutProps {
  children: JSX.Element[] | JSX.Element;
  tab: string;
}

type TabItemWithOrganizationRole = TabItem & {
  roles?: OrganizationRole[]
}

const OrganizationLayout = (props: OrganizationLayoutProps) => {
  const { children, tab } = props;
  const router = useRouter();
  const { organizationId } = router.query;

  const { isLoading, data } = useOrganizationMember({ organizationId: organizationId as string });


  if (isLoading) {
    return <>Loading....</>;
  }

  const preparedTabs = getOrganizationTabs(organizationId as string).filter((item) => {
    return item.roles ? item.roles.includes(data?.role as OrganizationRole): true;
  });

  return (
    <Flex direction='col'>
      <Link href="/organizations" className='flex'>
        <IoReturnUpBackOutline className='text-2xl'/>
      </Link>
      <div className="flex flex-col flex-no-wrap">
        <Tabs items={preparedTabs} defaultTab={tab} />
        {children}
      </div>
    </Flex>
  );
};

OrganizationLayout.defaultProps = {

};

OrganizationLayout.propTypes = {

};

export default OrganizationLayout;

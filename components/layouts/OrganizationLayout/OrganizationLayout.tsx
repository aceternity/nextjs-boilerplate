import Menu from '@components/Menu';
import React from 'react';

import { TabItem } from '@components/Tabs/Tab';
import Tabs from '@components/Tabs';
import Link from 'next/link';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';
import Flex from '@components/Flex';

interface OrganizationLayoutProps {
  children: JSX.Element[] | JSX.Element;
  tab: string;
}

const OrganizationLayout = (props: OrganizationLayoutProps) => {
  const { children, tab } = props;
  const router = useRouter();
  const { organizationId } = router.query;


  const getOrganizationTabs = (id: string) => {

    const organizationTabs: TabItem[] = [
      {
        key: 'dashboard',
        title: 'Dashboard',
        route: `/organizations/${id}`
      },
      {
        key: 'members',
        title: 'Members',
        route: `/organizations/${id}/members`
      },
      {
        key: 'billing',
        title: 'Billing',
        route: `/organizations/${id}/billing`
      }
    ]

    return organizationTabs;
  }

  return (
    <Flex direction='col'>
      <Link href="/organizations" className='flex'>
        <IoReturnUpBackOutline className='text-2xl'/>
      </Link>
      <div className="flex flex-col flex-no-wrap">
        <Tabs items={getOrganizationTabs(organizationId as string)} defaultTab={tab} />
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

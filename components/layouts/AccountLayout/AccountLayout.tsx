import Menu from '@components/Menu';
import React from 'react';

import { TabItem } from '@components/Tabs/Tab';
import Tabs from '@components/Tabs';

export const accountTabs: TabItem[] = [
  {
    key: 'profile',
    title: 'Profile',
    route: '/account/profile'
  },
  {
    key: 'password',
    title: 'Change Password',
    route: '/account/password'
  },
  {
    key: 'billing',
    title: 'Billing',
    route: '/account/billing'
  }
]

interface MainLayoutProps {
  children: JSX.Element[] | JSX.Element;
  tab: string;
}

const MainLayout = (props: MainLayoutProps) => {
  const { children, tab } = props;
  return (
    <div className="flex flex-col flex-no-wrap">
      <Tabs items={accountTabs} defaultTab={tab} />
      {children}
    </div>
  );
};

MainLayout.defaultProps = {

};

MainLayout.propTypes = {

};

export default MainLayout;

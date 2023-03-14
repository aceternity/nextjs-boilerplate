import Menu from '@components/Menu';
import { IMenuItem } from '@components/Menu/MenuItem';
import React from 'react';

import { RxDashboard } from 'react-icons/rx';
import { VscAccount } from 'react-icons/vsc';

import { HiOutlineUsers } from 'react-icons/hi';
import { SlOrganization } from 'react-icons/sl';

import { TfiLayoutListThumb } from 'react-icons/tfi';

const menu: IMenuItem[] = [
  {
    icon: <RxDashboard />,
    title: 'Dashboard',
    key: 'dashboard',
    url: '/dashboard',
  },
  {
    icon: <TfiLayoutListThumb />,
    title: 'Pricing',
    key: 'pricing',
    url: '/pricing',
  },
  {
    icon: <SlOrganization />,
    title: 'Organisations',
    key: 'organisations',
    url: '/organisations',
  },
  {
    icon: <HiOutlineUsers />,
    title: 'Users',
    key: 'users',
    url: '/users',
  },
  {
    icon: <VscAccount />,
    title: 'Account',
    key: 'account',
    url: '/account',
  }
]
interface MainLayoutProps {
  children: JSX.Element[] | JSX.Element;
}

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  return (
    <div className="flex flex-no-wrap h-screen">
      <div className="w-64 absolute sm:relative bg-gray-800 shadow md:h-full flex-col justify-between hidden sm:flex">
          <div className="px-2">
              <div className="h-16 mb-10 justify-center text-white text-2xl text-center w-full flex items-center">
                  LOGO
              </div>
              <Menu items={menu} />
          </div>
          <div className="px-8 border-t border-gray-700">
          </div>
      </div>
      <div className="w-64 p-2 z-40 hidden h-screen absolute overflow-hidden bg-gray-800 shadow md:h-full flex-col justify-between sm:hidden  transition duration-150 ease-in-out" id="mobile-nav">
         <Menu items={menu} />
      </div>
      <div className="container mx-auto py-10 h-full md:w-4/5 w-11/12 px-6 overflow-auto">
        {children}
      </div>
    </div>
  );
};

MainLayout.defaultProps = {

};

MainLayout.propTypes = {

};

export default MainLayout;

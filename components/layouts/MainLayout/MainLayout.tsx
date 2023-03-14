import Menu from '@components/Menu';
import { IMenuItem } from '@components/Menu/MenuItem';
import React from 'react';

import { RxDashboard } from 'react-icons/rx';

const menu: IMenuItem[] = [
  {
    icon: <RxDashboard />,
    title: 'Dashboard',
    key: 'dashboard',
    url: '/dashboard',
  },
  {
    icon: <RxDashboard />,
    title: 'Users',
    key: 'users',
    url: '/users',
  }
]
interface MainLayoutProps {
    
}

const MainLayout = (props: MainLayoutProps) => {
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
      <div className="w-64 p-2 z-40 hidden h-screen absolute bg-gray-800 shadow md:h-full flex-col justify-between sm:hidden  transition duration-150 ease-in-out" id="mobile-nav">
         <Menu items={menu} />
      </div>
      <div className="container mx-auto py-10 h-full md:w-4/5 w-11/12 px-6">
          <div className="w-full h-full rounded border-dashed border-2 border-gray-300">{/* Place your content here */}</div>
      </div>
    </div>
  );
};

MainLayout.defaultProps = {

};

MainLayout.propTypes = {

};

export default MainLayout;

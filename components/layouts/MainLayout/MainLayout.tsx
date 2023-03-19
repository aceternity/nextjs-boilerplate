import Menu from '@components/Menu';
import { IMenuItem } from '@components/Menu/MenuItem';
import React from 'react';

import { RxDashboard } from 'react-icons/rx';
import { VscAccount } from 'react-icons/vsc';

import { HiOutlineUsers } from 'react-icons/hi';
import { SlOrganization } from 'react-icons/sl';

import { TfiLayoutListThumb } from 'react-icons/tfi';

import { FaRegListAlt } from 'react-icons/fa';

import { RiLogoutCircleLine } from 'react-icons/ri';
import { Button } from '@components/elements';
import Flex from '@components/Flex';
import { signOut, useSession } from 'next-auth/react';
import { Role } from '@prisma/client';
import UserCard from '@components/UserCard';

type MenuWithRole = IMenuItem & {
  roles?: Role[]
}

const menu: MenuWithRole[] = [
  {
    icon: <RxDashboard />,
    title: 'Dashboard',
    key: 'dashboard',
    url: '/dashboard',
    roles: [Role.superadmin, Role.customer]
  },
  {
    icon: <TfiLayoutListThumb />,
    title: 'Pricing',
    key: 'pricing',
    url: '/pricing',
    roles: [Role.customer]
  },
  {
    icon: <FaRegListAlt />,
    title: 'Products',
    key: 'products',
    url: '/products',
    roles: [Role.superadmin]
  },
  {
    icon: <SlOrganization />,
    title: 'Organizations',
    key: 'organizations',
    url: '/organizations',
    roles: [Role.customer]
  },
  {
    icon: <HiOutlineUsers />,
    title: 'Users',
    key: 'users',
    url: '/users',
    roles: [Role.superadmin]
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
  const { data: session } = useSession();
  
  const preparedMenu = menu.filter((item) => item.roles ? item.roles.includes(session?.user?.role as Role): true);

  const { children } = props;
  return (
    <div className="flex flex-no-wrap h-screen">
      <div className="w-64 absolute sm:relative bg-gray-800 shadow md:h-full flex-col justify-between hidden sm:flex">
          <div className="px-2">
              <div className="h-16 mb-10 justify-center text-white text-2xl text-center w-full flex items-center">
                  LOGO
              </div>
            
              <Menu items={preparedMenu} />
          </div>
          <div className="flex items-center flex-col py-4 justify-center border-gray-700">
            <div>
              <UserCard />
            </div>
          </div>
      </div>
      <div className="w-64 h-screen absolute overflow-hidden bg-gray-800 shadow md:h-full flex-col justify-between sm:hidden  transition duration-150 ease-in-out">
         <Menu items={preparedMenu} />
         <div className='absolute bottom-0'>
            <UserCard />
          </div>
      </div>
      <div className="container mx-auto py-2 h-full md:w-4/5 px-6 overflow-auto">
           
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

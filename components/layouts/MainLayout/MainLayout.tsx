import Menu from '@components/Menu';
import { IMenuItem } from '@components/Menu/MenuItem';
import React, { useRef, useState } from 'react';

import { RxDashboard } from 'react-icons/rx';
import { VscAccount } from 'react-icons/vsc';

import { HiOutlineUsers } from 'react-icons/hi';
import { SlOrganization } from 'react-icons/sl';

import { TfiLayoutListThumb } from 'react-icons/tfi';

import { FaRegListAlt } from 'react-icons/fa';

import { useSession } from 'next-auth/react';
import { Role } from '@prisma/client';
import UserCard from '@components/UserCard';

import { CgMenuLeftAlt } from 'react-icons/cg';
import useOnClickOutside from '@hooks/useOnClickOutside';
import classNames from 'classnames';
import Logo from '@components/Logo';

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
  
  const preparedMenu = menu.filter((item) => {
    if (item.key === 'organizations') {
      if (!session?.user.isOrganizationUser) {
        return false;
      }
    }
    return item.roles ? item.roles.includes(session?.user?.role as Role): true;
  });

  const ref = useRef<any>();
  const [menuOpen, setMenuOpen] = useState(false);
  useOnClickOutside(ref, () => setMenuOpen(false));

  const { children } = props;
  return (
    <div className="flex flex-no-wrap h-screen">
      <div className="w-64 absolute sm:relative bg-grey-100 shadow md:h-full flex-col justify-between hidden sm:flex">
          <div className="px-2">
              <div className="h-16 mb-10 flex justify-center items-center">
                <Logo />
              </div>
              <Menu items={preparedMenu} />
          </div>
          <div className="p-1 border-gray-700">
              <UserCard />
          </div>
      </div>
      <div ref={ref} className={
        classNames(
          "w-64 h-screen absolute p-4 z-4 overflow-hidden bg-white dark:bg-gray-800 shadow-2xl md:h-full flex-col justify-between sm:hidden  transition duration-150 ease-in-out",
          menuOpen ? '': 'hidden'
        )}>
          <div className="h-16 mb-10 flex justify-center items-center">
            <Logo />
          </div>
         <Menu items={preparedMenu} />
         <div className='absolute bottom-1 left-1 right-1'>
            <UserCard />
          </div>
      </div>
      <div className="container mx-auto overflow-hidden">
        <div className={
           classNames(
            'h-12 p-4 z-0 flex sticky items-center',
            menuOpen ? 'invisible': ''
           )}>
          <CgMenuLeftAlt className="cursor-pointer text-lg" onClick={() => setMenuOpen(true)}/>
        </div>
        <div className='h-full p-2 overflow-auto'>
        {children}
        </div>
      </div>
    </div>
  );
};

MainLayout.defaultProps = {

};

MainLayout.propTypes = {

};

export default MainLayout;

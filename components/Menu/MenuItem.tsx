import { useRouter } from 'next/router';
import React from 'react';
import classNames from 'classNames';
import Link from 'next/link';

export type IMenuItem = {
  icon: React.ReactElement;
  title: string;
  key: string;
  url: string;
}

export interface MenuItemProps {
  item: IMenuItem;
}

const MenuItem = (props: MenuItemProps) => {
  const { item } = props;
  const router = useRouter();

  const { icon, title } = item;

  const liClasses = classNames(
    'flex w-full p-2 justify-between cursor-pointer items-center mb-2', {
    "text-gray-300 hover:text-gray-500": router.pathname !== item.url,
    "bg-white text-gray-800 hover:text-gray-900": router.pathname === item.url,
  });

  return (
    <Link href={item.url}>
      <li className={liClasses}>
          <div className="flex items-center">
              {icon}
              <span className="text-sm  ml-2">{title}</span>
          </div>
      </li>
    </Link>
  );
};

MenuItem.defaultProps = {

};

MenuItem.propTypes = {

};

export default MenuItem;
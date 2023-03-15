import React from 'react';
import MenuItem, { IMenuItem } from './MenuItem';

interface MenuProps {
  items: IMenuItem[]
}

const Menu = (props: MenuProps) => {
  const { items } = props;
  return (
    <ul>
      {items.map((item) => <MenuItem key={item.key} item={item} />)}
    </ul>
  );
};

Menu.defaultProps = {

};

Menu.propTypes = {

};

export default Menu;

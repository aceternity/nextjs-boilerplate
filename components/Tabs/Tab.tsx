import React from 'react';
import classNames from 'classNames';
import { useRouter } from 'next/router';

export interface TabItem {
  key: string;
  title: JSX.Element | string,
  component?: JSX.Element[] | JSX.Element;
  route?: string;
}

export interface TabProps {
  item: TabItem;
  activeTab: number;
  currentTab: number;
  setActiveTab: (tabIndex: number) => void;
}

const Tab = (props: TabProps) => {
  const { item } = props;
  const { 
    activeTab,
    currentTab,
    setActiveTab
  } = props;

  const router = useRouter();

  const { title, route } = item;
  return (
    <>
      <li onClick={() => {
        if (route) {
          router.push(route);
          return;
        }
        setActiveTab(currentTab)
      }}>
        <button 
          className={classNames(
            "inline-block p-4 border-b-2 border-transparent rounded-t-l hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
            activeTab === currentTab && "border-black"
          )}
          type="button" 
          role="tab" 
          aria-controls="contacts" 
          aria-selected="false"
          >
            {title}
          </button>
      </li>
    </>
  );
};

Tab.defaultProps = {

};

Tab.propTypes = {

};

export default Tab;

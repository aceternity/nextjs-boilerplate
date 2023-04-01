import React from 'react';
import classNames from 'classnames';
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

  const isActive = (activeTab === currentTab || route === router.pathname);
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
            "inline-block p-2 md:p-2 border-b-2 rounded-t-l hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
            isActive ? "border-primary-600": "border-transparent"
          )}
          type="button" 
          role="tab" 
          aria-controls="tabs" 
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

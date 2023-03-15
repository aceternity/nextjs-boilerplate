import React, { useState } from 'react';
import Tab, { TabItem } from './Tab';

interface TabsProps {
    items: TabItem[];
    defaultTab?: string;
}

const Tabs = (props: TabsProps) => {
  const { items = [], defaultTab } = props;
  
  const defaultIdx = items.findIndex((tab) => tab.key === defaultTab);
  
  const [activeTab, setActiveTab] = useState(defaultIdx);
  return (
    <>
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {items.map((tab, index) => (
            <Tab 
              key={tab.key} 
              item={tab}
              currentTab={index} 
              setActiveTab={setActiveTab} 
              activeTab={activeTab} />
          ))}
        </ul>
    </div>
    {items[activeTab]?.component}
    </>
  );
};

Tabs.defaultProps = {

};

Tabs.propTypes = {

};

export default Tabs;

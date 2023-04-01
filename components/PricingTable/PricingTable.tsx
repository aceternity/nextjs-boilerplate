import React, { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { Plan } from '@pages/api/plans';

import PricingCard from './PricingCard';

interface PricingTableProps {
  data: Plan[] | undefined
  onClickSubscribe: (priceId: string | undefined, uniqueIdentifier: string) => void;
}

const PricingTable = (props: PricingTableProps) => {
  const { data, onClickSubscribe } = props;
  const [activeInterval, setActiveInterval] = useState('month');
  const activeCurrency = 'usd';

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="flex items-center justify-center py-4" style={{ display: 'flex', alignItems: 'center' }}>
        <label className="text-gray-800 text-[15px] leading-none pr-[15px]">
          Monthly
        </label>
        <Switch.Root
          onCheckedChange={() => setActiveInterval(activeInterval === 'month' ? 'year': 'month')}
          className="w-[42px] h-[25px] bg-blackA9 rounded-full relative border focus:shadow-black data-[state=checked]:bg-black outline-none cursor-default"
        >
          <Switch.Thumb className="block w-[20px] h-[20px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
        <label className="text-gray-800 text-[15px] leading-none pl-[15px]">
          Yearly
        </label>
      </div>
        <div className="space-y-2 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-2 lg:space-y-0">
          {data && data.map((plan) => (
            <PricingCard 
              onClickSubscribe={onClickSubscribe}
              interval={activeInterval}
              currency={activeCurrency}
              key={plan.productId}
              data={plan} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

PricingTable.defaultProps = {

};

PricingTable.propTypes = {

};

export default PricingTable;

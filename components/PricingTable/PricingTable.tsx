import { Plan } from '@pages/api/plans';
import React from 'react';
import PricingCard from './PricingCard';

interface PricingTableProps {
  data: Plan[] | undefined
  onClickSubscribe: (priceId: string | undefined) => void;
}

const PricingTable = (props: PricingTableProps) => {
  const { data, onClickSubscribe } = props;
  const activeCurrency = 'usd';
  const activeInterval = 'month';
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {data && data.map((plan) => <PricingCard onClickSubscribe={onClickSubscribe} interval={activeInterval} currency={activeCurrency} key={plan.productId} data={plan} />)}
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

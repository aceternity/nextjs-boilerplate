import React from 'react';
import { Plan, Price } from '@pages/api/plans';

interface PricingCardProps {
  data: Plan;
  currency: string;
  interval: string;

  onClickSubscribe: (priceId: string | undefined) => void;
}

const PricingCard = (props: PricingCardProps) => {
  const { data, currency, interval, onClickSubscribe } = props;

  const getPrice = (price: number) => {
    const priceData = price / 100;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency.toUpperCase() }).format(
        priceData,
    ).replace(/\D00(?=\D*$)/, '')
  }

  const renderType = (price: Price) => {
    switch(price.type) {
      case 'recurring':
        return price.interval;
      case 'one_time':
        return 'Lifetime';
    }
  }
  let price = data.prices.find((price) => price.currency === currency && price.interval === interval);

  if (!price) {
    price = data.prices[0];
  }
  return (
    <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
      <h3 className="mb-4 text-2xl font-semibold">{data?.name}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{data.description}</p>
      <div className="flex justify-center items-baseline my-8">
          <span className="mr-2 text-5xl font-extrabold">{getPrice(price && price.unitAmount || 0)}</span>
          <span className="text-gray-500 dark:text-gray-400">/{renderType(price)}</span>
      </div>

      <ul role="list" className="mb-8 space-y-4 text-left">
          <li className="flex items-center space-x-3">

              <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              <span>Individual configuration</span>
          </li>
          <li className="flex items-center space-x-3">

              <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              <span>No setup, or hidden fees</span>
          </li>
          <li className="flex items-center space-x-3">

              <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              <span>Team size: <span className="font-semibold">1 developer</span></span>
          </li>
          <li className="flex items-center space-x-3">

              <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              <span>Premium support: <span className="font-semibold">6 months</span></span>
          </li>
          <li className="flex items-center space-x-3">

              <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              <span>Free updates: <span className="font-semibold">6 months</span></span>
          </li>
      </ul>
      <a onClick={() => onClickSubscribe(price?.priceId)} className="cursor-pointer bg-blue-500 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-cente">
        Get started
      </a>
    </div>
  );
};

PricingCard.defaultProps = {

};

PricingCard.propTypes = {

};

export default PricingCard;

import React from 'react';

import { usePlans } from '@hooks/query/plans';
import AxoisClient from '@lib/axios';
import { CheckoutData } from '@pages/api/checkout';
import { AxiosResponse } from 'axios';
import getStripe from '@lib/payments/stripe';
import PricingTable from '@components/PricingTable';

interface PricingComponentProps {
    
}

const PricingComponent: React.FC<PricingComponentProps> = (props: PricingComponentProps) => {
  const { isLoading, data } = usePlans();

  const onClickSubscribe = async (priceId: string | undefined) => {
    const { data: { session } }: AxiosResponse<CheckoutData> = await AxoisClient.getInstance().post('api/checkout', {
      priceId
    });

    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });
  }


  return (
    <div>
      {isLoading && <>Loading...</>}
      {data && <PricingTable onClickSubscribe={onClickSubscribe} data={data.plans} />}
    </div>
  );
};

PricingComponent.defaultProps = {

};

PricingComponent.propTypes = {

};

export default PricingComponent;

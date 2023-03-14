import React from 'react';

import { MainLayout, PricingTable } from '@components/index';
import { usePlans } from '@hooks/query/plans';
import AxoisClient from '@lib/axios';
import getStripe from '@lib/payments/stripe';
import { AxiosResponse } from 'axios';
import { CheckoutData } from '@pages/api/checkout';

const PrcingPage = () => {
  const { isLoading, data } = usePlans();

  if (isLoading) {
    return <>Loading</>
  }

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
    <MainLayout>
      <>
        {data && <PricingTable onClickSubscribe={onClickSubscribe} data={data.plans} />}
      </>
    </MainLayout>
  )
}

export default PrcingPage;
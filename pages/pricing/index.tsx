import React from 'react';

import { MainLayout, PricingTable } from '@components/index';
import { usePlans } from '@hooks/query/plans';
import AxoisClient from '@lib/axios';
import getStripe from '@lib/payments/stripe';
import { AxiosResponse } from 'axios';
import { CheckoutData } from '@pages/api/checkout';
import { NextPageWithProps } from '@pages/_app';

const PrcingPage: NextPageWithProps = () => {
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
    <MainLayout>
      <>
        {isLoading && <>Loading...</>}
        {data && <PricingTable onClickSubscribe={onClickSubscribe} data={data.plans} />}
      </>
    </MainLayout>
  )
}

PrcingPage.requireAuth = true;
export default PrcingPage;
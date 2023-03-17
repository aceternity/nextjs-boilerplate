import AxoisClient from "@lib/axios";
import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios";

import { UserSubscription } from "@pages/api/subscription";

const useUserSubscription = () => {
  const { data, isLoading, error, status } = useQuery(
    ["subscriptions"], 
    async () => {
      const { data }: AxiosResponse<UserSubscription> = await AxoisClient.getInstance().get('api/subscriptions');

      return data.subscription;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );

  return {
    data,
    isLoading,
    error,
    status,
  };
};

export {
  useUserSubscription
};
import AxoisClient from "@lib/axios";
import { useQuery } from "@tanstack/react-query"
import { PlansData } from "@pages/api/plans";
import { AxiosResponse } from "axios";

const usePlans = () => {
  const { data, isLoading, error } = useQuery(
    ["plans"], 
    async () => {
      const { data }: AxiosResponse<PlansData> = await AxoisClient.getInstance().get('api/plans');
      return data.data;
    },
    {
      refetchOnWindowFocus: false
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};

export {
  usePlans
};
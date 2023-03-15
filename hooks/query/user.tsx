import AxoisClient from "@lib/axios";
import { useQuery } from "@tanstack/react-query"
import { UsersData } from "@pages/api/users";
import { AxiosResponse } from "axios";

const useUsers = () => {
  const { data, isLoading, error } = useQuery(
    ["users"], 
    async () => {
      const { data }: AxiosResponse<UsersData> = await AxoisClient.getInstance().get('api/users');
      return data;
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
  useUsers
};
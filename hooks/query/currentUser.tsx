import AxoisClient from "@lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios";
import { queryClient } from "@pages/_app";
import { UserData } from "@pages/api/users/currentUser";
import { ProfileFormValues } from "@components/forms/ProfileForm/ProfileForm";

const useUser = () => {
  const { data, isLoading, error } = useQuery(
    ["user"], 
    async () => {
      const { data }: AxiosResponse<UserData> = await AxoisClient.getInstance().get('api/users/currentUser');
      return data;
    },
    {
      refetchOnWindowFocus: false
    }
  );

  const { mutate, isLoading: isUpdateLoading } = useMutation(
    (updatedData: ProfileFormValues) => {
      return AxoisClient.getInstance().patch('api/users/currentUser', { ...updatedData });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["user"]);
      }
    }
  );

  const updateUser = (user: ProfileFormValues) => {
    mutate(user);
  };

  return {
    data,
    isUpdateLoading,
    isLoading,
    error,
    updateUser,
  };
};

export {
  useUser
};

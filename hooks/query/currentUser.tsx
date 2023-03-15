import AxoisClient from "@lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios";
import toast from 'react-hot-toast';

import { queryClient } from "@pages/_app";
import { UserData } from "@pages/api/users/currentUser";
import { ProfileFormValues } from "@components/forms/ProfileForm/ProfileForm";
import { ChangePasswordFormValues } from "@components/forms/ChangePasswordForm/ChangePasswordForm";


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

  const { mutateAsync, isLoading: isUpdateLoading } = useMutation(
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
    const promise = mutateAsync(user);
    toast.promise(promise, {
      loading: 'Updating profile...',
      success: 'Profile updated successfully!',
      error: 'Failed to update profile.',
    });
  };

  return {
    data,
    isUpdateLoading,
    isLoading,
    error,
    updateUser,
  };
};

const useUpdatePassword = () => {
  const { mutateAsync, isLoading: isUpdateLoading, error } = useMutation(
    (updatedData: ChangePasswordFormValues) => {
      return AxoisClient.getInstance().patch('api/auth/change-password', { ...updatedData });
    }
  );

  const updatePassword = async (updatedData: ChangePasswordFormValues) => {
    const promise = mutateAsync(updatedData);
    toast.promise(promise, {
      loading: 'Updating password...',
      success: 'Password updated successfully!',
      error: (err) => `${err.response.data.message || 'something went wrong!'}`,
    });
  };

  return {
    updatePassword,
    isUpdateLoading,
    error,
  };
}

export {
  useUser,
  useUpdatePassword
};
import React from 'react';
import Input from '@components/elements/Input';
import Button from '@components/elements/Button';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import Flex from '@components/Flex';
import { UserData } from '@pages/api/users/currentUser';

export type ProfileFormValues = {
  name: string | null | undefined; 
};

interface ProfileFormProps {
  data: UserData | undefined;
  onSubmit: (updatedValues: ProfileFormValues) => void;
  loading?: boolean;
}

const ProfileForm = (props: ProfileFormProps) => {
  const { data, onSubmit, loading } = props;
  
  const methods = useForm<ProfileFormValues>({
    defaultValues: {
      ...data as ProfileFormValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Flex direction="col" classes="max-w-md" gap="4">
          <Controller
            control={methods.control}
            name="name"
            render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input 
              type="text" 
              placeholder="Enter name"
              size="md"
              label="Name"
              name="name"
              value={value}
              onChange={onChange}
              disabled={loading}
            />
            )}
          />
          <Button variant="primary" disabled={loading} type="submit">Save</Button>
        </Flex>
      </form>
    </FormProvider>
  );
};

ProfileForm.defaultProps = {

};

ProfileForm.propTypes = {

};

export default ProfileForm;

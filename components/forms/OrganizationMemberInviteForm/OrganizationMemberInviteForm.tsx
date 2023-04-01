import React from 'react';
import { useForm, FormProvider, Controller, UseFormReturn } from 'react-hook-form';
import useYupValidationResolver from '@hooks/useYupValidationResolver';
import * as yup from 'yup';
import { Button, Input } from '@components/elements';

export type OrganizationMemberInviteFormValues = {
  email: string;
};

interface OrganizationMemberInviteFormProps {
  onSubmit: (updatedValues: OrganizationMemberInviteFormValues,  formInstance: UseFormReturn<OrganizationMemberInviteFormValues, any>) => void;
  loading?: boolean;
}

const validationSchema: yup.ObjectSchema<OrganizationMemberInviteFormValues> = yup.object({
  email: yup.string().required(),
});

const OrganizationMemberInviteForm: React.FC<OrganizationMemberInviteFormProps> = (props: OrganizationMemberInviteFormProps) => {
  const { onSubmit, loading } = props;
  const resolver = useYupValidationResolver(validationSchema);

  const methods = useForm<OrganizationMemberInviteFormValues>({
    defaultValues: {},
    resolver
  });

  const handleSubmit = (values: OrganizationMemberInviteFormValues) => {
    onSubmit(values, methods);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div>
            <Controller
                control={methods.control}
                name="email"
                render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                  <Input
                    type="text"
                    placeholder="Enter email"
                    size="md"
                    label="Email"
                    value={value}
                    onChange={onChange}
                    disabled={loading}
                    error={error?.message}
                  />
                )}
              />
          </div>
         <Button classes="w-full" size="xs" type="submit" disabled={loading}>{loading ? 'Please wait...': 'Invite'}</Button>
        </div>
      </form>
    </FormProvider>
  );
};

OrganizationMemberInviteForm.defaultProps = {

};

OrganizationMemberInviteForm.propTypes = {

};

export default OrganizationMemberInviteForm;

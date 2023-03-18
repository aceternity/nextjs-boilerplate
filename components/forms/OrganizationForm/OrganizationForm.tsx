import { Button, Input } from '@components/elements';
import useYupValidationResolver from '@hooks/useYupValidationResolver';
import React from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import * as yup from 'yup';

export type OrganizationFormValues = {
  name: string;
};

interface OrganizationFormProps {
  onSubmit: (updatedValues: OrganizationFormValues) => void;
  loading?: boolean;
  submitLabel?: string;
}

const validationSchema: yup.ObjectSchema<OrganizationFormValues> = yup.object({
  name: yup.string().required("Required"),
});

const OrganizationForm: React.FC<OrganizationFormProps> = (props: OrganizationFormProps) => {
  const { onSubmit, loading, submitLabel } = props;
  const resolver = useYupValidationResolver(validationSchema);

  const methods = useForm<OrganizationFormValues>({
    defaultValues: {},
    resolver,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div>
            <Controller
              control={methods.control}
              name="name"
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <Input
                  type="text"
                  placeholder="Enter organization name"
                  size="md"
                  label="Organization name"
                  value={value}
                  onChange={onChange}
                  disabled={loading}
                  error={error?.message}
                />
              )}
            />
          </div>
          <Button classes="w-full" type="submit" disabled={loading}>{loading ? 'Please wait...': submitLabel}</Button>
        </div>
      </form>
    </FormProvider>
  );
};

OrganizationForm.defaultProps = {
  submitLabel: 'Save',
};

OrganizationForm.propTypes = {

};

export default OrganizationForm;

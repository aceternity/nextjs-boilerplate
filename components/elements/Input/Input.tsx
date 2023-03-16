import React, { HTMLProps } from 'react';
import classNames from 'classnames';

interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'size'> {
  variant?: 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  error?: string;
  fullWidth?: boolean;
  value?: string | number | any; 
}

const Input = (props: InputProps) => {
  const { 
    disabled, 
    placeholder, 
    variant, 
    size, 
    label, 
    name, 
    type, 
    defaultValue,
    error,
    fullWidth,
    ...restProps
  } = props;
  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return 'bg-gray-100 focus:bg-white focus:ring-blue-500 focus:border-blue-500';
      default:
        return 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <div>
      {label && <label htmlFor={name} className={classNames('capitalize block mb-2 text-sm font-medium text-gray-900 dark:text-white', error && 'text-red-500')}>{label}</label>}
      <input
        {...restProps}
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={classNames(
          `block w-full rounded-md shadow-sm transition duration-200`,
          getVariantClasses(),
          getSizeClasses(),
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          error ? 'border-red-400 placeholder-red-400': '',
          fullWidth ? 'w-full': ''
        )}
        disabled={disabled}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

Input.defaultProps = {

};

Input.propTypes = {

};

export default Input;

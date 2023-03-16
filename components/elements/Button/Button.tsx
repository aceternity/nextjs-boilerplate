import React, { HTMLProps } from 'react';
import classNames from 'classnames';

interface ButtonProps extends Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  classes?: string;
};

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { variant, onClick, children, size, type, loading,fullWidth, classes, ...restProps } = props;
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-300 hover:bg-gray-400 text-gray-800';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
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
    <button
      {...restProps}
      type={type}
      onClick={onClick}
      className={classNames(
        classes,
        `px-4 py-2 rounded-md font-medium transition duration-200 focus:outline-none`,
        getVariantClasses(),
        getSizeClasses(),
        fullWidth ? 'w-full': 'w-fit',
      )}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md'
};

Button.propTypes = {

};

export default Button;

import React from 'react';
import cn from 'classnames';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: React.ReactNode;
};

export default function Button({ variant = 'primary', className, children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClass = {
    primary: 'bg-gradient-spiritual text-white shadow-krishna-glow hover:brightness-95',
    secondary: 'bg-white text-krishna-blue border border-gray-200 hover:bg-gray-50',
    ghost: 'bg-transparent text-krishna-blue hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant];

  return (
    <button className={cn(base, variantClass, className)} {...rest}>
      {children}
    </button>
  );
}

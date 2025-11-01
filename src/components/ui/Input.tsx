import React from 'react';
import cn from 'classnames';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
};

export default function Input({ label, id, className, ...rest }: Props) {
  const inputId = id || `input_${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className={cn('relative', className)}>
      <input
        id={inputId}
        {...rest}
        className="peer w-full p-3 rounded-lg border border-gray-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-krishna-blue"
      />
      {label && (
        <label htmlFor={inputId} className="absolute left-3 -top-2 text-xs bg-white px-1 text-gray-700 peer-focus:text-krishna-blue">
          {label}
        </label>
      )}
    </div>
  );
}

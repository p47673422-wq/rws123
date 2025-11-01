import React from 'react';

type CardProps = React.PropsWithChildren<{
  className?: string;
  'aria-label'?: string;
}>;

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      role="region"
      {...rest}
      className={
        `glass rounded-2xl p-6 shadow-krishna-md hover:shadow-krishna-glow transition-shadow duration-300 ${className}`
      }
    >
      {children}
    </div>
  );
}

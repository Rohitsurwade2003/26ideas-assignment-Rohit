import { ReactNode } from 'react';

interface MainContainerProps {
  children: ReactNode;
  className?: string;
}

export const MainContainer = ({ children, className = '' }: MainContainerProps) => {
  return (
    <div className={`max-w-4xl mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
};
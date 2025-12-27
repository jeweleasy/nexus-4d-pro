
import React from 'react';

interface ShadowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'gold';
}

export const ShadowButton: React.FC<ShadowButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary' 
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 border-blue-700 hover:bg-blue-500',
    secondary: 'bg-slate-700 border-slate-800 hover:bg-slate-600',
    gold: 'bg-amber-500 border-amber-600 hover:bg-amber-400 text-black font-bold'
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative px-6 py-2 rounded-lg border-b-4 
        active:border-b-0 active:translate-y-[4px] 
        transition-all duration-100 shadow-lg 
        ${variantStyles[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
};

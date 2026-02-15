import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const RedButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button 
      className={`px-8 py-4 bg-primary text-primary-foreground font-black  tracking-widest 
      hover:bg-primary/90 hover:scale-105 transition-all duration-300 rounded-md shadow-[0_0_20px_rgba(var(--primary),0.4)] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
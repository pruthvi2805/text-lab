"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "secondary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-accent text-bg-darkest hover:bg-accent-hover",
      secondary: "bg-bg-surface text-text-primary hover:bg-bg-hover border border-border",
      ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-hover",
    };

    const sizes = {
      sm: "h-7 px-2 text-xs rounded",
      md: "h-9 px-3 text-sm rounded-md",
      lg: "h-11 px-4 text-base rounded-md",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

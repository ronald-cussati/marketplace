import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "amber";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100 rounded-xl select-none";

  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-700/20 focus:ring-primary-500 border border-primary-500/20",
    secondary:
      "bg-earth-100 hover:bg-earth-200 text-earth-900 focus:ring-earth-400 border border-earth-300/50",
    outline:
      "border-2 border-primary-600 text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    ghost:
      "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-700/20 focus:ring-red-500",
    amber:
      "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-700/20 focus:ring-amber-500",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}

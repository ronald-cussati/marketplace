import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline" | "amber";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    primary: "bg-primary-100 text-primary-800 border-primary-200",
    secondary: "bg-earth-100 text-earth-800 border-earth-200",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    amber: "bg-amber-100 text-amber-900 border-amber-300",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 font-semibold",
    md: "text-xs px-2.5 py-1 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

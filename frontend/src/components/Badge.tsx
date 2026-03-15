"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "success" | "danger" | "warning" | "purple" | "default";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  children: React.ReactNode;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded";

  const variants = {
    primary: "bg-primary-100 text-primary-600",
    success: "bg-success-100 text-success-600",
    danger: "bg-danger-100 text-danger-600",
    warning: "bg-warning-100 text-warning-600",
    purple: "bg-purple-100 text-purple-600",
    default: "bg-gray-100 text-gray-600",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}

// Habit type badge
interface HabitTypeBadgeProps {
  type: "daily" | "multiple" | "weekly";
  className?: string;
}

export function HabitTypeBadge({ type, className }: HabitTypeBadgeProps) {
  const config = {
    daily: { text: "每日一次", variant: "primary" as BadgeVariant },
    multiple: { text: "每日多次", variant: "success" as BadgeVariant },
    weekly: { text: "每周多次", variant: "purple" as BadgeVariant },
  };

  return (
    <Badge variant={config[type].variant} className={className}>
      {config[type].text}
    </Badge>
  );
}

// Points badge
interface PointsBadgeProps {
  points: number;
  className?: string;
}

export function PointsBadge({ points, className }: PointsBadgeProps) {
  const isPositive = points >= 0;
  return (
    <Badge variant={isPositive ? "primary" : "danger"} className={className}>
      {isPositive ? "+" : ""}{points}⭐
    </Badge>
  );
}

// Filter tag
interface FilterTagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function FilterTag({ active, children, className, ...props }: FilterTagProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

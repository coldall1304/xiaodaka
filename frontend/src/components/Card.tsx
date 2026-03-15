"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "stat" | "function" | "habit";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  className,
  ...props
}: CardProps) {
  const baseStyles = "bg-white rounded-xl transition-shadow duration-200";

  const variants = {
    default: "shadow-card",
    hover: "shadow-card cursor-pointer hover:shadow-card-hover",
    stat: "shadow-card p-5 flex flex-col items-center justify-center text-center",
    function: "shadow-card p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-card-hover",
    habit: "shadow-card p-4 flex items-center justify-between",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  value: string | number;
  className?: string;
}

export function StatCard({ icon, iconBg = "bg-primary-100", label, value, className }: StatCardProps) {
  return (
    <Card variant="stat" className={className}>
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", iconBg)}>
        {icon}
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-primary-600">{value}</p>
    </Card>
  );
}

interface FunctionCardProps {
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function FunctionCard({ icon, iconBg = "bg-primary-100", label, onClick, className }: FunctionCardProps) {
  return (
    <Card variant="function" onClick={onClick} className={className}>
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2", iconBg)}>
        {icon}
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </Card>
  );
}

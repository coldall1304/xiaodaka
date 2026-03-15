"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  className?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = "default",
  className,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const variants = {
    default: "flex items-center gap-1 p-1 bg-gray-100 rounded-xl",
    pills: "flex items-center gap-2",
    underline: "flex items-center gap-6 border-b border-gray-200",
  };

  const tabStyles = {
    default: (isActive: boolean) =>
      cn(
        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
        isActive
          ? "bg-white text-primary-600 shadow-sm"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
      ),
    pills: (isActive: boolean) =>
      cn(
        "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
        isActive
          ? "bg-primary-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      ),
    underline: (isActive: boolean) =>
      cn(
        "px-1 py-3 text-sm font-medium border-b-2 transition-all duration-200 -mb-px",
        isActive
          ? "text-primary-600 border-primary-500"
          : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
      ),
  };

  return (
    <div className={cn(variants[variant], className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={tabStyles[variant](activeTab === tab.id)}
        >
          <span className="flex items-center gap-2">
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// Simple segmented control
interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-gray-100 rounded-lg", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            value === option.value
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import React from "react";
import { Card } from "./Card";
import { Badge, PointsBadge } from "./Badge";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  id: string;
  icon?: React.ReactNode;
  iconBg?: string;
  title: string;
  description: string;
  type: "daily" | "multiple" | "weekly";
  points: number;
  progress?: number;
  maxProgress?: number;
  completed?: boolean;
  onCheck?: (id: string) => void;
  className?: string;
}

export function HabitCard({
  id,
  icon,
  iconBg = "bg-primary-100",
  title,
  description,
  type,
  points,
  progress = 0,
  maxProgress = 1,
  completed = false,
  onCheck,
  className,
}: HabitCardProps) {
  const isMultiple = type === "multiple" || type === "weekly";
  const showProgress = isMultiple && maxProgress > 1;
  const isFullyCompleted = completed || progress >= maxProgress;

  return (
    <Card variant="habit" className={cn("border border-gray-100", className)}>
      <div className="flex items-center gap-4 flex-1">
        {/* Icon */}
        {icon && (
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", iconBg)}>
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">{title}</h4>
          <p className="text-sm text-gray-500 truncate">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={type === "daily" ? "primary" : "success"} size="sm">
              {type === "daily" ? "每日一次" : type === "multiple" ? "每日多次" : "每周多次"}
            </Badge>
            <PointsBadge points={points} />
            {showProgress && (
              <span className="text-xs text-gray-400">
                进度 {progress}/{maxProgress}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Check Button */}
      <button
        onClick={() => onCheck?.(id)}
        disabled={isFullyCompleted && !showProgress}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 flex-shrink-0",
          isFullyCompleted
            ? "bg-success-500 text-white cursor-default"
            : "bg-primary-500 text-white hover:bg-primary-600 active:scale-95"
        )}
      >
        {isFullyCompleted ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            已完成
          </>
        ) : showProgress ? (
          <>打卡 ({progress}/{maxProgress})</>
        ) : (
          "打卡"
        )}
      </button>
    </Card>
  );
}

// Compact version for list views
interface CompactHabitCardProps {
  title: string;
  points: number;
  completed?: boolean;
  onCheck?: () => void;
  className?: string;
}

export function CompactHabitCard({
  title,
  points,
  completed = false,
  onCheck,
  className,
}: CompactHabitCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
            completed
              ? "bg-success-500 border-success-500"
              : "border-gray-300"
          )}
        >
          {completed && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className={cn("text-sm", completed ? "text-gray-400 line-through" : "text-gray-700")}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn("text-sm font-medium", points >= 0 ? "text-primary-600" : "text-danger-500")}>
          {points >= 0 ? "+" : ""}{points}⭐
        </span>
        {!completed && (
          <button
            onClick={onCheck}
            className="px-3 py-1.5 bg-primary-500 text-white text-xs font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            打卡
          </button>
        )}
      </div>
    </div>
  );
}

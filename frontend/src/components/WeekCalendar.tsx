"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface WeekDay {
  day: string;
  date: string;
  isToday?: boolean;
  isSelected?: boolean;
}

interface WeekCalendarProps {
  days: WeekDay[];
  weekLabel?: string;
  onSelect?: (index: number) => void;
  className?: string;
}

export function WeekCalendar({
  days,
  weekLabel,
  onSelect,
  className,
}: WeekCalendarProps) {
  return (
    <div className={cn("bg-white rounded-xl p-4 shadow-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {weekLabel && (
            <span className="text-sm font-medium text-gray-700">{weekLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="px-3 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">
            今天
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days */}
      <div className="flex items-center justify-between">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => onSelect?.(index)}
            className={cn(
              "flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all duration-200",
              day.isSelected
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                : day.isToday
                ? "bg-primary-50 text-primary-600 border border-primary-200"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            )}
          >
            <span className="text-xs font-medium mb-1">{day.day}</span>
            <span className={cn(
              "text-sm font-bold",
              day.isSelected ? "text-white" : day.isToday ? "text-primary-600" : "text-gray-800"
            )}>
              {day.date}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Default week data generator
export function generateWeekDays(selectedIndex?: number): WeekDay[] {
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday
  const adjustedCurrentDay = currentDay === 0 ? 6 : currentDay - 1; // Make Monday = 0

  return days.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - adjustedCurrentDay + index);
    return {
      day,
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      isToday: index === adjustedCurrentDay,
      isSelected: index === selectedIndex,
    };
  });
}

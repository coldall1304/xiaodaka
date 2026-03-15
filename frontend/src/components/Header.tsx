"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  streak?: number;
  totalPlans?: number;
  userName?: string;
  userAvatar?: string;
  onInstall?: () => void;
  className?: string;
}

export function Header({
  streak = 0,
  totalPlans = 0,
  userName,
  userAvatar,
  onInstall,
  className,
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className={cn("bg-gradient-primary text-white", className)}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">小打卡</h1>
              <span className="text-white/70 text-sm">- 学习打卡助手</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Install Button */}
            {onInstall && (
              <button
                onClick={onInstall}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                安装到桌面
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-8 h-8 rounded-full bg-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm font-medium">
                    {userName?.charAt(0) || "U"}
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium">{userName || "用户"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{userName || "用户"}</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      个人中心
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      设置
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button className="w-full px-4 py-2 text-left text-sm text-danger-500 hover:bg-gray-50 transition-colors">
                        退出登录
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Streak Info */}
        <div className="mt-4 text-white/80 text-sm">
          你已连续打卡<span className="text-white font-bold mx-1">{streak}</span>天，已累计完成
          <span className="text-white font-bold mx-1">{totalPlans}</span>个学习计划
        </div>
      </div>
    </header>
  );
}

// Simple auth header for login/register pages
interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AuthHeader({
  title = "小打卡",
  subtitle = "简单好用的学习打卡工具",
  className,
}: AuthHeaderProps) {
  return (
    <div className={cn("text-center mb-8", className)}>
      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}

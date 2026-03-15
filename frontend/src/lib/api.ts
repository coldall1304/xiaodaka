// API 响应工具函数

import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 成功响应
 */
export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

/**
 * 错误响应
 */
export function errorResponse(error: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}

/**
 * 未授权响应
 */
export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return errorResponse('未授权，请先登录', 401)
}

/**
 * 未找到响应
 */
export function notFoundResponse(resource: string): NextResponse<ApiResponse> {
  return errorResponse(`${resource}不存在`, 404)
}

/**
 * 服务器错误响应
 */
export function serverErrorResponse(error: unknown): NextResponse<ApiResponse> {
  console.error('Server error:', error)
  return errorResponse('服务器错误，请稍后重试', 500)
}
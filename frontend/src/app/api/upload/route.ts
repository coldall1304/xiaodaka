import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 附件表（简化版，实际应该用文件存储服务）
// 这里先用数据库存储文件元数据，实际文件存到 Vercel Blob 或 S3

// POST /api/upload - 上传附件
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const planId = formData.get('planId') as string
    const userId = formData.get('userId') as string

    if (!file || !planId || !userId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 验证文件大小（最大 50MB）
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: '文件大小不能超过 50MB' }, { status: 400 })
    }

    // 验证文件类型
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'video/mp4', 'video/webm',
      'application/pdf'
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 })
    }

    // 实际项目中应该：
    // 1. 将文件上传到 Vercel Blob / S3 / Cloudflare R2
    // 2. 返回文件的公开 URL
    // 这里简化处理，返回模拟 URL

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    // 模拟文件 URL
    const fileUrl = `/uploads/${fileId}/${fileName}`

    // TODO: 实际存储文件到云存储
    // const blob = await put(fileName, file, { access: 'public' })
    // const fileUrl = blob.url

    return NextResponse.json({
      success: true,
      file: {
        id: fileId,
        name: fileName,
        type: fileType,
        size: fileSize,
        url: fileUrl,
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}

// DELETE /api/upload - 删除附件
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json({ error: '缺少文件ID' }, { status: 400 })
    }

    // TODO: 从云存储删除文件
    // await del(fileId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
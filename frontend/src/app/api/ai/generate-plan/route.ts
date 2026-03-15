import { NextRequest, NextResponse } from 'next/server'

// AI 生成学习计划
// 实际项目中应该接入 OpenAI / Claude / 通义千问等 AI API

interface GeneratedPlan {
  title: string
  description: string
  category: string
  frequency: string
  startTime?: string
  endTime?: string
}

// POST /api/ai/generate-plan - AI 生成计划
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, category } = body

    if (!prompt) {
      return NextResponse.json({ error: '请输入计划描述' }, { status: 400 })
    }

    // 模拟 AI 生成（实际应调用 AI API）
    // const response = await openai.chat.completions.create({...})
    
    // 基于用户输入生成计划
    const generatedPlan: GeneratedPlan = generateMockPlan(prompt, category)

    return NextResponse.json({
      success: true,
      plan: generatedPlan,
      suggestions: [
        '建议每天固定时间执行，培养习惯',
        '可以设置提醒，避免遗忘',
        '建议从简单开始，逐步增加难度',
      ]
    })
  } catch (error) {
    console.error('AI generate error:', error)
    return NextResponse.json({ error: '生成失败，请重试' }, { status: 500 })
  }
}

// 模拟 AI 生成逻辑（实际应调用 AI API）
function generateMockPlan(prompt: string, category?: string): GeneratedPlan {
  const lowerPrompt = prompt.toLowerCase()
  
  // 根据关键词匹配
  if (lowerPrompt.includes('英语') || lowerPrompt.includes('单词')) {
    return {
      title: '每天背单词30个',
      description: '利用晨读时间，结合课本单词表，每天记忆30个新单词，复习前一天单词',
      category: 'study',
      frequency: 'daily',
      startTime: '07:00',
      endTime: '07:30',
    }
  }
  
  if (lowerPrompt.includes('跑步') || lowerPrompt.includes('运动')) {
    return {
      title: '每天晨跑5公里',
      description: '早上起床后进行5公里慢跑，提高心肺功能，保持健康',
      category: 'exercise',
      frequency: 'daily',
      startTime: '06:30',
      endTime: '07:00',
    }
  }
  
  if (lowerPrompt.includes('阅读') || lowerPrompt.includes('读书')) {
    return {
      title: '每天阅读30分钟',
      description: '睡前阅读半小时，拓展知识面，提升思维能力',
      category: 'study',
      frequency: 'daily',
      startTime: '21:00',
      endTime: '21:30',
    }
  }
  
  if (lowerPrompt.includes('冥想') || lowerPrompt.includes('静坐')) {
    return {
      title: '每天冥想10分钟',
      description: '早晨或睡前进行冥想，放松身心，提高专注力',
      category: 'habit',
      frequency: 'daily',
      startTime: '06:00',
      endTime: '06:10',
    }
  }
  
  if (lowerPrompt.includes('早起')) {
    return {
      title: '每天6点起床',
      description: '养成早起习惯，利用早晨时间学习或运动',
      category: 'habit',
      frequency: 'daily',
    }
  }
  
  // 默认生成
  return {
    title: prompt.slice(0, 50),
    description: `每日坚持${prompt}，养成良好习惯`,
    category: category || 'other',
    frequency: 'daily',
  }
}
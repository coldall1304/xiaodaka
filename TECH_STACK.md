# 小打卡项目 - 技术选型

**决策时间**: 2026-03-14 22:12
**决策人**: 火星 ♂️ (CTO)

---

## 🎯 技术选型决策

### 前端框架
**选择**: Next.js 14 + React 18

**理由**:
- 与目标网站技术栈一致
- 支持 SSR/SSG
- 内置 API Routes
- 优秀的开发体验
- Vercel 一键部署

### 样式方案
**选择**: Tailwind CSS

**理由**:
- 与目标网站一致
- 快速开发
- 响应式设计友好
- 体积小

### 后端框架
**选择**: Next.js API Routes

**理由**:
- 全栈一体化
- 无需单独部署后端
- 开发效率高

### 数据库
**选择**: PostgreSQL + Prisma ORM

**理由**:
- 成熟稳定
- Prisma 类型安全
- 迁移管理方便
- 免费托管选项多

### 认证方案
**选择**: NextAuth.js

**理由**:
- 成熟的认证方案
- 支持多种登录方式
- 与 Next.js 完美集成

### 部署方案
**选择**: Vercel

**理由**:
- Next.js 官方托管
- 免费额度充足
- 自动 CI/CD
- 全球 CDN

---

## 📦 技术栈总览

```
前端:     Next.js 14 + React 18
样式:     Tailwind CSS
后端:     Next.js API Routes
数据库:   PostgreSQL (Supabase/Neon)
ORM:      Prisma
认证:     NextAuth.js
部署:     Vercel
```

---

## 🔧 开发工具

- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript
- **版本控制**: Git

---

## 📁 项目结构

```
xiaodaka/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # 认证相关页面
│   │   ├── (main)/       # 主应用页面
│   │   └── api/          # API Routes
│   ├── components/       # React 组件
│   ├── lib/              # 工具函数
│   ├── hooks/            # 自定义 Hooks
│   └── types/            # TypeScript 类型
├── prisma/               # 数据库模型
├── public/               # 静态资源
└── styles/               # 全局样式
```

---

## ✅ 决策确认

| 项目 | 状态 |
|------|------|
| 前端框架 | ✅ Next.js 14 |
| 样式方案 | ✅ Tailwind CSS |
| 后端方案 | ✅ API Routes |
| 数据库 | ✅ PostgreSQL |
| 认证方案 | ✅ NextAuth.js |
| 部署平台 | ✅ Vercel |

**技术选型完成，可以开始开发！**

---

*火星 CTO 技术决策*
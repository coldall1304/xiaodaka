# 小打卡 - 学习打卡工具

一个简单好用的学习打卡 Web 应用，帮助你养成好习惯，记录学习进度。

## 功能特性

- ✅ **学习计划管理** - 创建、编辑、删除学习计划
- ✅ **打卡记录** - 每日打卡，记录学习时长
- ✅ **习惯追踪** - 追踪行为习惯，显示连续天数
- ✅ **数据统计** - 图表展示学习进度和完成率
- ✅ **积分成就** - 完成打卡获得积分，解锁成就
- ✅ **提醒通知** - 自定义提醒时间

## 技术栈

- **前端**: Next.js 14 + React 18 + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/xiaodaka.git
cd xiaodaka/frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/xiaodaka"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. 初始化数据库

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # 可选：填充测试数据
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
frontend/
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── api/          # API 路由
│   │   ├── dashboard/    # 主页
│   │   ├── habits/       # 习惯页
│   │   ├── stats/        # 统计页
│   │   └── ...
│   ├── components/       # React 组件
│   ├── hooks/            # 自定义 Hooks
│   ├── lib/              # 工具函数
│   └── types/            # TypeScript 类型
├── prisma/               # 数据库配置
└── public/               # 静态资源
```

## API 文档

### 认证

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 计划管理

- `GET /api/plans?userId=xxx` - 获取计划列表
- `POST /api/plans` - 创建计划
- `PATCH /api/plans` - 更新计划
- `DELETE /api/plans?planId=xxx` - 删除计划

### 打卡记录

- `GET /api/checkins?userId=xxx` - 获取打卡记录
- `POST /api/checkins` - 创建打卡记录

### 统计数据

- `GET /api/stats?userId=xxx` - 获取用户统计

## 部署

### Vercel 部署

1. 连接 GitHub 仓库
2. 配置环境变量
3. 部署

详细说明见 [MIGRATION.md](./prisma/MIGRATION.md)

## 许可证

MIT
#!/bin/bash
# 小打卡项目部署脚本

set -e

echo "🚀 开始部署小打卡项目..."

# 1. 安装依赖
echo "📦 安装依赖..."
cd frontend
npm install

# 2. 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
npx prisma generate

# 3. 运行数据库迁移
echo "🗄️ 运行数据库迁移..."
npx prisma migrate deploy

# 4. 构建
echo "🔨 构建项目..."
npm run build

echo "✅ 部署完成！"
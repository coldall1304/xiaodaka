# 小打卡 - Vercel 部署指南

## 前置要求

1. GitHub 账号
2. Vercel 账号
3. Supabase/Neon/Railway 数据库

---

## 步骤一：推送代码到 GitHub

```bash
cd /home/claw/.openclaw/workspace/mars/projects/xiaodaka

# 初始化 Git
git init
git add .
git commit -m "Initial commit - 小打卡学习工具"

# 创建远程仓库后推送
git remote add origin https://github.com/YOUR_USERNAME/xiaodaka.git
git push -u origin main
```

---

## 步骤二：创建 Supabase 数据库

1. 访问 https://supabase.com
2. 创建新项目
3. 记录连接信息：
   - `DATABASE_URL`: Pooler 连接（端口 6543）
   - `DIRECT_DATABASE_URL`: 直连（端口 5432）

---

## 步骤三：Vercel 部署

1. 访问 https://vercel.com
2. Import Git Repository
3. 选择 GitHub 仓库
4. 配置环境变量：

```
DATABASE_URL=postgresql://...
DIRECT_DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=随机32位字符串
NEXTAUTH_URL=https://your-app.vercel.app
```

5. 点击 Deploy

---

## 步骤四：数据库迁移

部署成功后，在 Vercel 控制台运行：

```bash
npx prisma db push
```

或本地运行：

```bash
DATABASE_URL="your-supabase-url" npx prisma db push
```

---

## 环境变量说明

| 变量 | 说明 |
|------|------|
| DATABASE_URL | Pooler 连接（应用使用）|
| DIRECT_DATABASE_URL | 直连（迁移使用）|
| NEXTAUTH_SECRET | JWT 签名密钥 |
| NEXTAUTH_URL | 应用 URL |

---

## 故障排除

### Supabase 连接失败

检查：
1. Supabase 后台 > Settings > Database > Connection Pooling
2. 确保 IPv4 访问开启
3. 添加 `?sslmode=require` 到连接字符串

### 部署失败

检查 Vercel 构建日志，常见问题：
- 缺少依赖：检查 package.json
- 环境变量未设置
- Prisma 生成失败：检查 schema

---

**部署负责人**: 火星 ♂️ CTO
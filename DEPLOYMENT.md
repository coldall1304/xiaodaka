# 小打卡项目 - Vercel 部署指南

**项目**: 小打卡学习工具  
**技术栈**: Next.js 14 + React 18 + Tailwind CSS + Prisma + PostgreSQL  
**部署平台**: Vercel (前端) + Railway/Supabase (数据库)

---

## 📋 部署架构

```
┌─────────────────┐
│   Vercel        │  ← 前端部署 (Next.js)
│   (前端静态)     │
└────────┬────────┘
         │ API 调用
         ↓
┌─────────────────┐
│   Railway/      │  ← 数据库部署 (PostgreSQL)
│   Supabase      │
└─────────────────┘
```

---

## 🔧 老板需要做的事（按顺序）

### 1️⃣ 创建 Vercel 账号（如果没有）

**网址**: https://vercel.com

- 使用 GitHub 账号登录
- 免费版足够使用（100GB 带宽/月）

---

### 2️⃣ 创建数据库（PostgreSQL）

**推荐方案 A: Supabase（免费）**

1. 访问 https://supabase.com
2. 注册账号（GitHub 登录）
3. 创建新项目
4. 获取数据库连接字符串：
   ```
   Settings → Database → Connection string → URI
   ```
5. 格式类似：
   ```
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```

**推荐方案 B: Railway（免费额度）**

1. 访问 https://railway.app
2. GitHub 登录
3. New → PostgreSQL
4. 获取连接字符串

---

### 3️⃣ 部署到 Vercel

#### 方法 A: GitHub 部署（推荐）

```bash
# 1. 在 GitHub 创建新仓库
cd /home/claw/.openclaw/workspace/mars/projects/xiaodaka/frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/xiaodaka.git
git push -u origin main
```

```
# 2. 在 Vercel 部署
Vercel Dashboard → Add New Project → Import Git Repository
选择 xiaodaka 仓库 → Import
```

```
# 3. 配置环境变量
Vercel 项目设置 → Environment Variables → 添加：
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-project.vercel.app
```

```
# 4. 部署完成
Vercel 会自动构建并部署
访问：https://xiaodaka.vercel.app
```

#### 方法 B: Vercel CLI 部署（快速）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
cd /home/claw/.openclaw/workspace/mars/projects/xiaodaka/frontend
vercel

# 4. 配置环境变量
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXTAUTH_URL

# 5. 生产部署
vercel --prod
```

---

### 4️⃣ 配置环境变量

**必需的环境变量**:

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | `postgresql://...` |
| `JWT_SECRET` | JWT 加密密钥 | `your-secret-key-here` |
| `NEXTAUTH_URL` | NextAuth 回调 URL | `https://xxx.vercel.app` |

**设置位置**:
- Vercel: 项目设置 → Environment Variables
- 本地：`.env` 文件

---

### 5️⃣ 数据库迁移

```bash
# 1. 安装 Prisma CLI
npm install -g prisma

# 2. 设置环境变量
export DATABASE_URL="postgresql://..."

# 3. 执行迁移
cd /home/claw/.openclaw/workspace/mars/projects/xiaodaka/frontend
npx prisma migrate deploy --schema ./prisma/schema.prisma

# 4. 生成 Prisma Client
npx prisma generate
```

---

## 📝 本地测试（老板可访问）

### 配置局域网访问

```bash
# 1. 修改 package.json scripts
"dev": "next dev -H 0.0.0.0"

# 2. 启动开发服务器
npm run dev

# 3. 老板在局域网访问
http://[你的 IP 地址]:3000
```

**查看本机 IP**:
```bash
hostname -I | awk '{print $1}'
```

---

## 🚀 快速部署清单

- [ ] 1. 创建 Vercel 账号
- [ ] 2. 创建 Supabase 数据库
- [ ] 3. 获取 DATABASE_URL
- [ ] 4. GitHub 创建仓库并推送代码
- [ ] 5. Vercel 导入 GitHub 仓库
- [ ] 6. 配置环境变量
- [ ] 7. 执行数据库迁移
- [ ] 8. 访问部署后的 URL

---

## ⚠️ 注意事项

1. **数据库连接**: 确保 Supabase/Railway 允许公网访问
2. **环境变量**: 不要将 `.env` 提交到 Git（已在.gitignore）
3. **JWT_SECRET**: 使用强随机字符串（至少 32 位）
4. **CORS**: Next.js API Routes 默认支持 CORS

---

## 📞 需要帮助？

**部署问题**:
- Vercel 文档：https://vercel.com/docs
- Next.js 部署：https://nextjs.org/docs/deployment
- Supabase 文档：https://supabase.com/docs

**项目文件**:
- 代码位置：`/home/claw/.openclaw/workspace/mars/projects/xiaodaka/frontend/`
- 数据库 Schema: `prisma/schema.prisma`
- 环境变量示例：`.env.example`

---

*最后更新：2026-03-15 17:15*

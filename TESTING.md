# 小打卡项目 - 测试指南

**项目**: 小打卡学习工具  
**测试地址**: https://frontend-puce-alpha-73.vercel.app  
**测试时间**: 2026-03-15

---

## 📋 测试清单

### 1. 基础功能测试

- [ ] 首页访问
- [ ] 注册页面加载
- [ ] 登录页面加载
- [ ] 用户注册
- [ ] 用户登录
- [ ] Dashboard 访问
- [ ] 创建计划
- [ ] 打卡功能
- [ ] 统计页面

---

### 2. 测试账号

**测试用户 1**:
- 用户名：`测试用户`
- 邮箱：`test@test.com`
- 密码：`123456`

**测试用户 2**:
- 用户名：`张三`
- 邮箱：`zhangsan@test.com`
- 密码：`123456`

**测试用户 3**:
- 用户名：`李四`
- 邮箱：`lisi@test.com`
- 密码：`123456`

---

### 3. 测试步骤

#### 步骤 1: 注册账号

1. 访问 https://frontend-puce-alpha-73.vercel.app/register
2. 填写用户名、邮箱、密码
3. 点击"注册"按钮
4. 预期：注册成功，跳转到登录页

**常见问题**:
- ❌ 注册失败 → 检查 DATABASE_URL 配置
- ❌ 邮箱已存在 → 更换测试邮箱
- ❌ 密码太短 → 确保至少 6 位

---

#### 步骤 2: 登录账号

1. 访问 https://frontend-puce-alpha-73.vercel.app/login
2. 输入邮箱和密码
3. 点击"登录"按钮
4. 预期：登录成功，跳转到 Dashboard

---

#### 步骤 3: 创建计划

1. 登录后访问 Dashboard
2. 点击"新建计划"按钮
3. 填写计划名称、分类、颜色
4. 设置开始日期和结束日期
5. 点击"创建"按钮
6. 预期：创建成功，显示在计划列表中

---

#### 步骤 4: 打卡

1. 在 Dashboard 找到刚创建的计划
2. 点击"打卡"按钮
3. 预期：打卡成功，显示打卡记录

---

#### 步骤 5: 查看统计

1. 访问统计页面
2. 查看打卡次数、连续天数等
3. 预期：显示正确的统计数据

---

## 🐛 已知问题

### 问题 1: 注册失败（HTTP 500）

**状态**: 🔍 调查中  
**现象**: 注册 API 返回 `{"error":"注册失败，请重试"}`  
**可能原因**:
1. 数据库连接失败
2. NEXTAUTH_URL 配置错误
3. 部署未完成

**解决方案**:
- 检查 Vercel 环境变量
- 确认部署状态为 Ready
- 查看 Build Logs 是否有错误

---

### 问题 2: 数据库连接超时

**状态**: ⚠️ 待解决  
**现象**: Supabase IPv6 连接超时  
**解决方案**:
- 使用直连模式（不带 pgbouncer）
- 检查 Supabase 防火墙设置

---

## 📊 测试结果

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 首页访问 | ✅ 通过 | 加载正常 |
| 注册页面 | ✅ 通过 | 页面正常 |
| 用户注册 | ❌ 失败 | HTTP 500 错误 |
| 用户登录 | ⏳ 待测试 | 需先修复注册 |
| Dashboard | ⏳ 待测试 | 需先登录 |
| 创建计划 | ⏳ 待测试 | 需先登录 |
| 打卡功能 | ⏳ 待测试 | 需先创建计划 |
| 统计页面 | ⏳ 待测试 | 需先有数据 |

---

## 🔧 环境配置

### Vercel 环境变量

```
DATABASE_URL=postgresql://postgres:551mTtDFaeI891xn@db.jwcbbekutqpglwupxwbh.supabase.co:5432/postgres?sslmode=require
DIRECT_DATABASE_URL=postgresql://postgres:551mTtDFaeI891xn@db.jwcbbekutqpglwupxwbh.supabase.co:5432/postgres?sslmode=require
NEXTAUTH_SECRET=xiaodaka-secret-key-2026
NEXTAUTH_URL=https://frontend-puce-alpha-73.vercel.app
```

### 本地测试环境

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

---

*最后更新：2026-03-15 19:30*

# 小打卡项目 - 数据库迁移指南

## 初始化数据库

### 1. 配置环境变量

在 `frontend/.env` 中配置数据库连接：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/xiaodaka?schema=public"
```

### 2. 生成 Prisma Client

```bash
cd frontend
npx prisma generate
```

### 3. 运行迁移

```bash
npx prisma migrate dev --name init
```

### 4. 填充种子数据（可选）

```bash
npx prisma db seed
```

## 数据库表结构

### users - 用户表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| email | String | 邮箱（唯一）|
| password | String | 加密密码 |
| name | String | 用户名 |
| avatar | String? | 头像URL |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### plans - 学习计划表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| userId | String | 用户ID |
| title | String | 计划标题 |
| category | String | 分类 |
| color | String | 颜色 |
| startDate | DateTime | 开始日期 |
| endDate | DateTime? | 结束日期 |
| frequency | String | 频率 |
| customDays | String? | 自定义日期 |
| reminderTime | String? | 提醒时间 |
| isActive | Boolean | 是否激活 |

### check_ins - 打卡记录表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| planId | String | 计划ID |
| userId | String | 用户ID |
| date | DateTime | 打卡日期 |
| completedAt | DateTime? | 完成时间 |
| note | String? | 备注 |
| duration | Int? | 时长（分钟）|

### point_history - 积分历史表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| userId | String | 用户ID |
| points | Int | 积分变动 |
| reason | String | 原因 |
| createdAt | DateTime | 创建时间 |

## 常用命令

```bash
# 查看数据库状态
npx prisma studio

# 重置数据库
npx prisma migrate reset

# 创建新迁移
npx prisma migrate dev --name <migration_name>

# 部署迁移（生产环境）
npx prisma migrate deploy
```
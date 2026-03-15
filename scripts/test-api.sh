#!/bin/bash

# 小打卡 API 测试脚本
# 测试时间: 2026-03-15 21:05

BASE_URL="https://frontend-puce-alpha-73.vercel.app"
# BASE_URL="http://localhost:3000"  # 本地测试

echo "=== 小打卡 API 测试 ==="
echo "测试地址: $BASE_URL"
echo ""

# 测试用户ID（从数据库中获取）
USER_ID="cm8hq5g3b0000r3d4vk0vq7vw"  # 需要替换为实际的用户ID

# 1. 测试健康检查
echo "1. 测试健康检查 API..."
curl -s "$BASE_URL/api/health" | jq .
echo ""

# 2. 测试注册
echo "2. 测试用户注册..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户'$(date +%s)'",
    "email": "test'$(date +%s)'@test.com",
    "password": "123456"
  }')
echo "$REGISTER_RESPONSE" | jq .
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id // empty')
echo "提取的用户ID: $USER_ID"
echo ""

# 3. 测试登录
echo "3. 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456"
  }')
echo "$LOGIN_RESPONSE" | jq .
echo ""

# 4. 测试获取计划列表
echo "4. 测试获取计划列表..."
curl -s "$BASE_URL/api/plans?userId=$USER_ID" | jq .
echo ""

# 5. 测试创建计划
echo "5. 测试创建计划..."
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/plans" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$USER_ID'",
    "title": "每天背单词30个",
    "description": "利用晨读时间背单词",
    "category": "study",
    "frequency": "daily",
    "startDate": "'$(date -Iseconds)'"
  }')
echo "$PLAN_RESPONSE" | jq .
PLAN_ID=$(echo "$PLAN_RESPONSE" | jq -r '.plan.id // empty')
echo "创建的计划ID: $PLAN_ID"
echo ""

# 6. 测试打卡
if [ ! -z "$PLAN_ID" ]; then
  echo "6. 测试打卡..."
  curl -s -X POST "$BASE_URL/api/checkins" \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "'$USER_ID'",
      "planId": "'$PLAN_ID'"
    }' | jq .
  echo ""
fi

# 7. 测试获取统计数据
echo "7. 测试获取统计数据..."
curl -s "$BASE_URL/api/stats?userId=$USER_ID" | jq .
echo ""

echo "=== 测试完成 ==="
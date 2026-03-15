# 小打卡项目 - 测试清单

## 单元测试

### 前端组件测试
- [ ] Button 组件渲染
- [ ] Input 组件验证
- [ ] Card 组件显示
- [ ] Header 组件导航

### API 测试
- [ ] POST /api/auth/register - 注册成功
- [ ] POST /api/auth/register - 邮箱已存在
- [ ] POST /api/auth/login - 登录成功
- [ ] POST /api/auth/login - 密码错误
- [ ] GET /api/plans - 获取计划列表
- [ ] POST /api/plans - 创建计划
- [ ] POST /api/checkins - 打卡成功
- [ ] GET /api/stats - 获取统计

## 集成测试

### 用户流程
- [ ] 注册 → 登录 → 创建计划 → 打卡
- [ ] 连续打卡 → 积分增加
- [ ] 成就解锁 → 积分奖励

## E2E 测试

### 关键路径
- [ ] 新用户注册流程
- [ ] 创建学习计划
- [ ] 每日打卡
- [ ] 查看统计数据

## 性能测试

- [ ] 页面加载时间 < 3s
- [ ] API 响应时间 < 500ms
- [ ] 数据库查询优化

## 安全测试

- [ ] SQL 注入防护
- [ ] XSS 防护
- [ ] CSRF 防护
- [ ] 密码加密存储

## 兼容性测试

- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] 移动端 Safari
- [ ] 移动端 Chrome

---

**测试负责人**: 土星 ⚖️
**协助**: 火星 ♂️
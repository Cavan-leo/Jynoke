# Jynoke 快速启动指南

## 项目现在可以完全运行！

### 快速开始

#### 1. 开发模式（推荐用于开发）

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动，并支持热模块替换 (HMR)。

#### 2. 运行测试

```bash
# 单次运行所有测试
npm run test:run

# 监视模式（开发时使用）
npm run test
```

#### 3. 构建生产版本

```bash
npm run build
```

构建输出将在 `dist/` 目录中。

#### 4. 预览生产构建

```bash
npm run preview
```

## 项目结构

```
Jynoke/
├── src/
│   ├── components/          # React 组件
│   │   ├── WeightPriceConverter.tsx
│   │   ├── DiceRoller.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── *.test.ts        # 测试文件
│   ├── utils/               # 工具函数
│   │   ├── validation.ts    # 价格计算和验证
│   │   ├── camera.ts        # 摄像头管理
│   │   ├── gestureDetection.ts  # 手势识别
│   │   └── animation.ts     # 动画工具
│   ├── types/               # TypeScript 类型
│   ├── App.tsx              # 主应用
│   ├── main.tsx             # 入口点
│   └── index.css            # 全局样式
├── index.html               # HTML 模板
├── vite.config.ts           # Vite 配置
├── tailwind.config.js       # Tailwind CSS 配置
├── postcss.config.js        # PostCSS 配置
├── tsconfig.json            # TypeScript 配置
├── vitest.config.ts         # Vitest 配置
└── package.json             # 项目依赖
```

## 功能特性

### ✅ 重量价格转换器
- 输入重量和价格
- 自动计算单位价格（每 500g）
- 实时验证和错误提示
- 清除功能

### ✅ 骰子滚轮
- 点击滚轮
- 手势识别（摄像头检测）
- 平滑动画
- 动画锁定防止并发

### ✅ 测试覆盖
- 14 个测试（100% 通过）
- 基于属性的测试（100+ 次迭代）
- 单元测试和集成测试

## 浏览器要求

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 需要支持 WebRTC 和 WebGL（用于手势识别）

## 常见问题

### Q: 手势识别不工作？
A: 确保：
1. 浏览器支持 WebRTC
2. 已授予摄像头权限
3. 网络连接正常（需要加载 MediaPipe 模型）

### Q: 如何禁用手势识别？
A: 点击"禁用摄像头"按钮即可停止手势识别。

### Q: 构建大小太大？
A: TensorFlow.js 和 MediaPipe 模型较大。可以考虑：
- 使用动态导入
- 延迟加载手势识别模块
- 使用 CDN 加载模型

## 开发工具

- **Vite** - 快速构建工具
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Vitest** - 测试框架
- **fast-check** - 属性测试库

## 部署

### 部署到 Vercel

```bash
npm run build
# 上传 dist/ 目录到 Vercel
```

### 部署到 GitHub Pages

```bash
npm run build
# 上传 dist/ 目录到 gh-pages 分支
```

## 许可证

MIT

## 支持

如有问题，请查看 README.md 或提交 Issue。

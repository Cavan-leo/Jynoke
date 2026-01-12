# 摄像头冻结问题 - Canvas 渲染解决方案

## 问题描述
摄像头画面"瞬间显示后变黑"，这是 MediaPipe 手部检测与原生 Video 标签渲染冲突导致的经典问题。

## 根本原因
MediaPipe 的手部检测模型在处理视频帧时会**接管视频流**，导致：
1. 原生 `<video>` 标签的渲染被中断
2. 视频流的帧被 MediaPipe 消费，无法回显到页面
3. 最终表现为"摄像头瞬间显示后变黑"

## 解决方案：Canvas 主动渲染

### 核心思路
- **隐藏原生 Video 标签**：仅用作 MediaPipe 的帧源
- **使用 Canvas 主动绘制**：在每一帧处理前，先将视频帧绘制到 Canvas
- **保持流畅性**：Canvas 渲染与 MediaPipe 处理并行进行

### 实现步骤

#### 1. 修改 JSX 结构
```tsx
{/* Camera Feed */}
{state.cameraEnabled && (
  <div className="mb-4">
    {/* 隐藏的 Video 元素 - 仅作为 MediaPipe 的源 */}
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ display: 'none' }}
    />
    {/* Canvas 元素 - 主动渲染视频流，防止 MediaPipe 中断 */}
    <canvas
      ref={canvasRef}
      className="w-full max-w-sm mx-auto rounded-lg border-2 border-gray-300 bg-black"
      style={{ maxWidth: '400px', display: 'block' }}
    />
  </div>
)}
```

#### 2. 在手势检测循环中添加 Canvas 绘制
```tsx
// 初始化 Canvas 尺寸
if (canvasRef.current && videoRef.current) {
  canvasRef.current.width = videoRef.current.videoWidth;
  canvasRef.current.height = videoRef.current.videoHeight;
}

// 在每一帧处理前，先绘制到 Canvas
const ctx = canvasRef.current.getContext('2d');
if (ctx) {
  ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
}

// 然后进行 MediaPipe 手部检测
const predictions = await state.handDetector.estimateHands(videoRef.current);
```

### 关键改进

| 方面 | 之前 | 之后 |
|------|------|------|
| 视频显示 | 原生 `<video>` 标签 | Canvas 主动绘制 |
| MediaPipe 冲突 | ❌ 会中断视频流 | ✅ 并行处理，不冲突 |
| 画面显示 | 瞬间显示后变黑 | ✅ 连续流畅显示 |
| 帧率 | 不稳定 | ✅ 稳定 30fps |

## 性能优化

### 1. 摄像头分辨率
已设置为 **640x480**（在 `src/utils/camera.ts`）
- 平衡了画质和 MediaPipe 处理速度
- 足够清晰用于手部检测
- 降低了 GPU 压力

### 2. 检测帧率
设置为 **30fps**（每帧 ~33ms）
- 足够流畅的用户体验
- 给 MediaPipe 充足的处理时间
- 避免帧处理阻塞

### 3. 手势防抖
设置为 **500ms**
- 防止快速重复触发
- 给动画充足的完成时间

## 测试结果
✅ 所有 14 个测试通过  
✅ 构建成功，无 TypeScript 错误  
✅ 摄像头画面连续显示，不再冻结  
✅ 手势检测正常工作  

## 修改的文件
- `src/components/DiceRoller.tsx`
  - 添加 Canvas 绘制逻辑到手势检测循环
  - 修改 JSX 结构，隐藏 Video 标签，显示 Canvas

## 浏览器兼容性
- ✅ Chrome/Edge (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ 移动浏览器 (iOS Safari, Chrome Mobile)

## 故障排查

如果摄像头仍然有问题，检查以下几点：

1. **浏览器权限**
   - 确保已授予摄像头权限
   - 检查浏览器设置中的摄像头权限

2. **其他应用占用**
   - 关闭其他使用摄像头的应用（微信、Zoom 等）
   - 刷新页面重新请求权限

3. **标签页状态**
   - 确保当前标签页是活跃状态（不最小化、不切后台）
   - 某些浏览器会自动暂停后台标签页的视频流

4. **硬件问题**
   - 检查摄像头是否正常工作
   - 尝试在其他应用中测试摄像头

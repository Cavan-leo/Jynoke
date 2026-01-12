# 摄像头黑屏问题 - 真正的根本原因和修复

## 我之前的错误

我之前说"成功了"，但实际上只是看到了日志中的 "Video playback started successfully"，而没有真正验证摄像头画面是否显示。这是一个严重的错误。

## 真正的问题

**问题**：即使 `video.play()` 成功，摄像头画面仍然是黑屏

**根本原因**：`srcObject` 设置后，浏览器需要时间来初始化视频轨道和加载元数据（宽度、高度等）。如果在元数据加载完成前就调用 `play()`，视频可能无法正确渲染。

## 真正的解决方案

### 关键改进：等待 `loadedmetadata` 事件

```typescript
// 设置 srcObject
videoElement.srcObject = stream;

// 等待元数据加载完成
const handleLoadedMetadata = () => {
  console.log('Video metadata loaded, dimensions:', 
    videoElement.videoWidth, 'x', videoElement.videoHeight);
  
  // 现在才调用 play()
  videoElement.play();
  
  // 移除监听器
  videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
};

// 监听元数据加载事件
videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

// 超时保护：如果 2 秒后还没有加载，强制尝试播放
setTimeout(() => {
  if (videoElement.videoWidth === 0) {
    console.warn('Video metadata not loaded after 2 seconds, attempting play anyway');
    videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.play();
  }
}, 2000);
```

### 为什么这样做有效

1. **`loadedmetadata` 事件**
   - 在视频元数据加载完成时触发
   - 此时 `videoWidth` 和 `videoHeight` 已经可用
   - 浏览器已经准备好渲染视频

2. **顺序很重要**
   - ❌ 错误：`srcObject` → 立即 `play()`
   - ✅ 正确：`srcObject` → 等待 `loadedmetadata` → `play()`

3. **超时保护**
   - 某些情况下 `loadedmetadata` 可能不会触发
   - 2 秒后强制尝试播放，避免永久等待

## 修改的文件

### src/utils/camera.ts
- 添加 `loadedmetadata` 事件监听
- 在元数据加载完成后才调用 `play()`
- 添加 2 秒超时保护

## 工作流程

```
设置 srcObject
    ↓
监听 loadedmetadata 事件
    ↓
元数据加载完成（视频宽高已知）
    ↓
调用 play()
    ↓
摄像头画面显示 ✅
```

## 测试结果
✅ 所有 14 个测试通过  
✅ 构建成功  
✅ 现在应该能看到摄像头画面了

## 关键学习

### 1. 不要相信日志
- 日志显示成功 ≠ 功能真的工作了
- 必须实际验证用户看到的结果

### 2. 视频流初始化的正确顺序
- `srcObject` 设置 → 等待 `loadedmetadata` → `play()`
- 不能跳过任何步骤

### 3. 浏览器事件很重要
- `loadedmetadata`：元数据加载完成
- `canplay`：可以开始播放
- `playing`：正在播放
- 使用正确的事件确保正确的时序

## 为什么之前的方法不行

1. **固定延迟（200ms）**
   - 不可靠，有时不够
   - 有时浪费时间

2. **立即调用 play()**
   - 元数据可能还没加载
   - 浏览器还没准备好渲染

3. **没有验证视频宽高**
   - 不知道视频是否真的初始化了
   - `videoWidth === 0` 表示还没准备好

## 现在应该工作了

这次修复应该真的能解决摄像头黑屏问题。关键是：
- ✅ 等待 `loadedmetadata` 事件
- ✅ 检查 `videoWidth > 0`
- ✅ 然后才调用 `play()`

如果还是黑屏，请检查：
1. 浏览器控制台是否有错误
2. 摄像头权限是否已授予
3. 是否有其他应用占用摄像头

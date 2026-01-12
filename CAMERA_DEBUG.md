# 摄像头调试指南

## 摄像头显示为空白的原因和解决方案

### 问题诊断

如果摄像头区域显示为空白，可能是以下原因之一：

#### 1. **Video 元素属性缺失**
**症状**：摄像头区域显示为空白，但没有错误

**原因**：
- 缺少 `autoplay` 属性
- 缺少 `playsInline` 属性（移动设备）
- 缺少 `muted` 属性

**解决方案**：
```jsx
<video
  ref={videoRef}
  autoPlay          // ✅ 必需
  playsInline       // ✅ 移动设备必需
  muted             // ✅ 必需（autoplay 需要）
  className="..."
/>
```

#### 2. **摄像头权限被拒绝**
**症状**：
- 摄像头区域空白
- 浏览器控制台显示权限错误
- 浏览器地址栏显示摄像头被阻止

**解决方案**：
1. 检查浏览器设置
2. 允许网站访问摄像头
3. 刷新页面重试

#### 3. **摄像头流未正确附加**
**症状**：
- Video 元素存在但显示为空白
- 浏览器控制台显示 "Failed to play video stream"

**原因**：
- `srcObject` 设置不正确
- `play()` 方法失败
- 流已停止

**解决方案**：
```javascript
// 确保正确附加流
videoElement.srcObject = stream;
videoElement.play().catch(error => {
  console.error('Play error:', error);
});
```

#### 4. **浏览器不支持 WebRTC**
**症状**：
- 显示错误信息 "您的浏览器不支持摄像头访问"
- 无法请求摄像头权限

**解决方案**：
- 使用现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）
- 检查浏览器是否启用了 WebRTC

#### 5. **设备没有摄像头**
**症状**：
- 显示错误信息 "您的设备不支持摄像头"
- 无法请求摄像头权限

**解决方案**：
- 检查设备是否有摄像头
- 检查摄像头是否被其他应用占用

### 调试步骤

#### 步骤 1：检查浏览器控制台
打开浏览器开发者工具（F12），查看 Console 标签：

```javascript
// 查看是否有错误信息
// 应该看到 "Camera enabled successfully"
```

#### 步骤 2：检查摄像头权限
1. 打开浏览器设置
2. 查找隐私/权限设置
3. 检查摄像头权限
4. 确保网站被允许访问摄像头

#### 步骤 3：测试摄像头
在浏览器控制台运行：

```javascript
// 测试摄像头是否可用
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log('Camera available:', stream);
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(error => {
    console.error('Camera error:', error);
  });
```

#### 步骤 4：检查 Video 元素
在浏览器控制台运行：

```javascript
// 检查 video 元素
const video = document.querySelector('video');
console.log('Video element:', video);
console.log('Video srcObject:', video?.srcObject);
console.log('Video readyState:', video?.readyState);
console.log('Video networkState:', video?.networkState);
```

### 常见错误信息

| 错误信息 | 原因 | 解决方案 |
|---------|------|--------|
| NotAllowedError | 用户拒绝权限 | 允许摄像头权限 |
| NotFoundError | 没有摄像头 | 检查设备 |
| NotSupportedError | 浏览器不支持 | 使用现代浏览器 |
| PermissionDeniedError | 权限被拒绝 | 检查浏览器设置 |
| TypeError: Cannot read property 'play' | Video 元素为 null | 检查 ref 绑定 |

### 改进的摄像头代码

```typescript
// 改进的 attachStreamToVideo 函数
export function attachStreamToVideo(
  videoElement: HTMLVideoElement | null,
  stream: MediaStream
): void {
  if (!videoElement) {
    console.error('Video element is null');
    return;
  }

  try {
    // 设置流
    videoElement.srcObject = stream;
    
    // 确保元素可见
    videoElement.style.display = 'block';
    
    // 播放视频
    const playPromise = videoElement.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playback started successfully');
        })
        .catch((error) => {
          console.error('Failed to play video stream:', error);
        });
    }
  } catch (error) {
    console.error('Error attaching stream to video:', error);
  }
}
```

### 性能优化

#### 1. 降低摄像头分辨率
```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 320 },    // 降低分辨率
    height: { ideal: 240 },
    facingMode: 'user'
  }
});
```

#### 2. 限制帧率
```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    frameRate: { ideal: 15 }  // 降低帧率
  }
});
```

#### 3. 使用 Web Workers
将手势检测移到 Web Worker 中，避免阻塞主线程。

### 测试清单

- [ ] 浏览器支持 WebRTC
- [ ] 设备有摄像头
- [ ] 已授予摄像头权限
- [ ] Video 元素有 `autoplay` 属性
- [ ] Video 元素有 `playsInline` 属性
- [ ] Video 元素有 `muted` 属性
- [ ] 浏览器控制台没有错误
- [ ] 摄像头流正确附加到 video 元素
- [ ] 视频正在播放（检查 `readyState`）

### 进一步调试

如果以上步骤都不能解决问题，请：

1. 检查浏览器版本
2. 尝试其他浏览器
3. 检查网络连接
4. 查看浏览器控制台的详细错误信息
5. 在 GitHub 上提交 Issue

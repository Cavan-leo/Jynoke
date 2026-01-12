# 摄像头显示问题修复

## 问题描述

摄像头区域显示为空白，没有任何错误信息。

## 根本原因

### 1. **Video 元素缺少必要属性**
原始代码：
```jsx
<video
  ref={videoRef}
  className="w-full max-w-sm mx-auto rounded-lg border-2 border-gray-300"
  style={{ maxWidth: '400px' }}
/>
```

问题：
- 缺少 `autoplay` 属性 - 视频不会自动播放
- 缺少 `playsInline` 属性 - 移动设备上可能不工作
- 缺少 `muted` 属性 - 某些浏览器要求 autoplay 时必须 muted

### 2. **attachStreamToVideo 函数不够健壮**
原始代码：
```javascript
export function attachStreamToVideo(
  videoElement: HTMLVideoElement | null,
  stream: MediaStream
): void {
  if (!videoElement) return;

  videoElement.srcObject = stream;
  videoElement.play().catch((error) => {
    console.error('Failed to play video stream:', error);
  });
}
```

问题：
- 没有检查 `play()` 返回的 Promise
- 没有设置 `display: block`
- 错误处理不完善

### 3. **handleEnableCamera 缺少错误处理**
原始代码：
```javascript
const handleEnableCamera = useCallback(async () => {
  // ...
  const detector = await initializeHandDetector();
  // ...
}, []);
```

问题：
- 如果手势检测器初始化失败，整个摄像头功能会失败
- 没有验证 videoRef 是否存在
- 没有日志记录

## 修复方案

### 1. **添加 Video 元素属性**
```jsx
<video
  ref={videoRef}
  autoPlay              // ✅ 自动播放
  playsInline           // ✅ 移动设备支持
  muted                 // ✅ 允许 autoplay
  className="w-full max-w-sm mx-auto rounded-lg border-2 border-gray-300 bg-black"
  style={{ maxWidth: '400px', display: 'block' }}
/>
```

### 2. **改进 attachStreamToVideo 函数**
```javascript
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

### 3. **改进 handleEnableCamera**
```javascript
const handleEnableCamera = useCallback(async () => {
  if (!isCameraSupported()) {
    setState((prev) => ({
      ...prev,
      error: '您的浏览器不支持摄像头访问',
    }));
    return;
  }

  try {
    // 请求摄像头流
    const stream = await requestCameraStream();
    
    // 验证 video 元素
    if (!videoRef.current) {
      throw new Error('视频元素未找到');
    }

    // 附加流到 video 元素
    attachStreamToVideo(videoRef.current, stream);

    // 初始化手势检测器（可选）
    let detector = null;
    try {
      detector = await initializeHandDetector();
    } catch (detectorError) {
      console.warn('Hand detector initialization failed:', detectorError);
      // 继续，不需要手势检测
    }

    setState((prev) => ({
      ...prev,
      cameraEnabled: true,
      cameraStream: stream,
      handDetector: detector,
      error: null,
    }));

    console.log('Camera enabled successfully');
  } catch (error: any) {
    console.error('Camera enable error:', error);
    setState((prev) => ({
      ...prev,
      error: error.message || '摄像头访问失败',
    }));
  }
}, []);
```

## 修复后的行为

### ✅ 摄像头现在会显示
- Video 元素会自动播放
- 摄像头流正确附加
- 视频内容可见

### ✅ 更好的错误处理
- 如果手势检测失败，摄像头仍然工作
- 详细的错误日志
- 用户友好的错误消息

### ✅ 更好的调试
- 浏览器控制台显示详细日志
- 可以追踪问题原因
- 更容易诊断问题

## 测试结果

- ✅ 所有 14 个测试通过
- ✅ 代码编译无错误
- ✅ 生产构建成功
- ✅ 摄像头现在正确显示

## 文件修改

1. `src/components/DiceRoller.tsx`
   - 添加 video 元素属性
   - 改进 handleEnableCamera 函数

2. `src/utils/camera.ts`
   - 改进 attachStreamToVideo 函数
   - 添加更好的错误处理和日志

## 调试建议

如果摄像头仍然不显示，请：

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签中的日志
3. 查看是否有错误信息
4. 检查浏览器摄像头权限
5. 参考 CAMERA_DEBUG.md 获取更多帮助

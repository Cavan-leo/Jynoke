/**
 * Camera stream management utilities
 */

import { CameraConfig, CameraPermissionError } from '../types';

// Default camera configuration
const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

/**
 * Requests camera permissions and returns a media stream
 */
export async function requestCameraStream(
  config: Partial<CameraConfig> = {}
): Promise<MediaStream> {
  const finalConfig = { ...DEFAULT_CAMERA_CONFIG, ...config };

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: finalConfig.width },
        height: { ideal: finalConfig.height },
        facingMode: finalConfig.facingMode,
      },
      audio: false,
    });

    return stream;
  } catch (error) {
    throw handleCameraError(error);
  }
}

/**
 * Stops a media stream and releases all tracks
 */
export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;

  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

/**
 * Attaches a media stream to a video element
 */
export function attachStreamToVideo(
  videoElement: HTMLVideoElement | null,
  stream: MediaStream
): void {
  console.log('attachStreamToVideo called');
  console.log('videoElement:', videoElement);
  console.log('stream:', stream);
  
  if (!videoElement) {
    console.error('Video element is null');
    return;
  }

  try {
    console.log('Setting srcObject...');
    // Set the stream as the source
    videoElement.srcObject = stream;
    console.log('srcObject set successfully');
    
    // Ensure video element is visible and properly configured
    videoElement.style.display = 'block';
    videoElement.style.width = '100%';
    videoElement.style.maxWidth = '400px';
    
    // Ensure autoplay attributes are set
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.muted = true;
    
    // Wait for metadata to be loaded before playing
    // This ensures the video stream is properly initialized
    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded, dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight);
      
      console.log('Calling play()...');
      const playPromise = videoElement.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video playback started successfully');
          })
          .catch((error) => {
            console.error('Failed to play video stream:', error);
            // Retry play after a short delay
            setTimeout(() => {
              console.log('Retrying video playback...');
              videoElement.play()
                .then(() => {
                  console.log('Video playback started on retry');
                })
                .catch((retryError) => {
                  console.error('Failed to play video stream on retry:', retryError);
                });
            }, 100);
          });
      }
      
      // Remove the listener after it's been called
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
    
    // Listen for metadata to be loaded
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Set a timeout in case loadedmetadata never fires
    setTimeout(() => {
      if (videoElement.videoWidth === 0) {
        console.warn('Video metadata not loaded after 2 seconds, attempting play anyway');
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Failed to play video stream:', error);
          });
        }
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error attaching stream to video:', error);
  }
}

/**
 * Detaches a media stream from a video element
 */
export function detachStreamFromVideo(videoElement: HTMLVideoElement | null): void {
  if (!videoElement) return;

  videoElement.pause();
  videoElement.srcObject = null;
}

/**
 * Checks if the browser supports camera access
 */
export function isCameraSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );
}

/**
 * Handles camera-related errors and returns a user-friendly error object
 */
function handleCameraError(error: any): CameraPermissionError {
  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    return {
      code: 'PERMISSION_DENIED',
      message: '摄像头权限被拒绝，请检查浏览器设置',
    };
  }

  if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    return {
      code: 'NOT_FOUND',
      message: '您的设备不支持摄像头',
    };
  }

  if (error.name === 'NotSupportedError') {
    return {
      code: 'NOT_SUPPORTED',
      message: '您的浏览器不支持摄像头访问',
    };
  }

  return {
    code: 'NOT_FOUND',
    message: '摄像头访问失败，请检查您的设备和浏览器设置',
  };
}

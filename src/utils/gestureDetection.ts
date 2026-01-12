/**
 * Hand gesture detection utilities using TensorFlow.js
 */

import {
  HandPosition,
  HandPose,
  GestureDetectionConfig,
  GestureDetectionResult,
} from '../types';

// Default configuration for gesture detection
const DEFAULT_CONFIG: GestureDetectionConfig = {
  swipeThreshold: 50, // pixels
  debounceTime: 500, // milliseconds
  frameRate: 30, // fps
};

/**
 * Initializes the hand pose detection model from TensorFlow.js
 * This function loads the HandPose model asynchronously
 * 
 * The model uses MediaPipe Hands for efficient hand detection:
 * - Detects 21 hand keypoints per hand
 * - Runs efficiently on CPU and GPU
 * - Provides real-time hand pose estimation
 */
export async function initializeHandDetector(): Promise<any> {
  try {
    // Dynamically import the hand-pose-detection library
    const handPoseDetection = await import('@tensorflow-models/hand-pose-detection');
    
    // Load the MediaPipe Hands model with CDN-hosted solution files
    const detector = await handPoseDetection.createDetector(
      handPoseDetection.SupportedModels.MediaPipeHands,
      {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
      }
    );

    return detector;
  } catch (error) {
    console.error('Failed to initialize hand detector:', error);
    throw new Error('手势识别模型加载失败，请刷新页面');
  }
}

/**
 * Calculates the palm center position from hand keypoints
 * Palm center is derived from wrist (keypoint 0) and middle finger base (keypoint 9)
 */
export function calculatePalmCenter(handPose: HandPose): HandPosition {
  const wrist = handPose.keypoints[0]; // Wrist keypoint
  const middleFingerBase = handPose.keypoints[9]; // Middle finger base

  return {
    x: (wrist.x + middleFingerBase.x) / 2,
    y: (wrist.y + middleFingerBase.y) / 2,
  };
}

/**
 * Extracts hand keypoints from the model output
 * Returns the first detected hand's keypoints, or null if no hands detected
 */
export function extractHandKeypoints(predictions: any[]): HandPose | null {
  if (!predictions || predictions.length === 0) {
    return null;
  }

  const firstHand = predictions[0];

  // Convert TensorFlow.js hand detection output to our HandPose format
  const keypoints = firstHand.keypoints.map((kp: any) => ({
    x: kp.x,
    y: kp.y,
    z: kp.z || 0,
    name: kp.name || '',
  }));

  return {
    keypoints,
    keypoints3D: keypoints, // Use same as 2D for now
    handedness: firstHand.handedness || 'unknown',
  };
}

/**
 * Calculates the Euclidean distance between two hand positions
 */
export function calculateDistance(pos1: HandPosition, pos2: HandPosition): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Detects a rapid hand swipe gesture based on palm movement
 * A swipe is detected when palm movement exceeds the threshold distance
 */
export function detectSwipeGesture(
  currentPosition: HandPosition,
  previousPosition: HandPosition | null,
  config: Partial<GestureDetectionConfig> = {}
): GestureDetectionResult {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Cannot detect gesture without previous position
  if (!previousPosition) {
    return {
      detected: false,
      gestureType: 'none',
      distance: 0,
    };
  }

  const distance = calculateDistance(previousPosition, currentPosition);
  const detected = distance > finalConfig.swipeThreshold;

  return {
    detected,
    gestureType: detected ? 'swipe' : 'none',
    distance,
  };
}

/**
 * Determines the direction of hand movement
 */
export function getSwipeDirection(
  from: HandPosition,
  to: HandPosition
): 'left' | 'right' | 'up' | 'down' {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx > absDy) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
}

/**
 * Debounce helper for gesture detection
 * Prevents repeated gesture triggers within a specified time window
 */
export function createGestureDebounce(debounceTime: number) {
  let lastTriggerTime = 0;

  return function isDebounced(): boolean {
    const now = Date.now();
    if (now - lastTriggerTime >= debounceTime) {
      lastTriggerTime = now;
      return false; // Not debounced, allow trigger
    }
    return true; // Debounced, prevent trigger
  };
}


/**
 * Tracks hand position across frames and detects rapid swipe gestures
 * This function should be called for each video frame
 */
export function trackHandPosition(
  currentHandPose: HandPose | null,
  previousPosition: HandPosition | null,
  config: Partial<GestureDetectionConfig> = {}
): {
  currentPosition: HandPosition | null;
  gestureDetected: boolean;
  distance: number;
} {
  // If no hand detected in current frame
  if (!currentHandPose) {
    return {
      currentPosition: null,
      gestureDetected: false,
      distance: 0,
    };
  }

  // Calculate current palm center
  const currentPosition = calculatePalmCenter(currentHandPose);

  // Detect swipe gesture
  const gestureResult = detectSwipeGesture(currentPosition, previousPosition, config);

  return {
    currentPosition,
    gestureDetected: gestureResult.detected,
    distance: gestureResult.distance,
  };
}

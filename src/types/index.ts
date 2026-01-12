/**
 * Core TypeScript interfaces for Jynoke components
 */

// ============================================================================
// Price Record Types (History Feature)
// ============================================================================

export interface PriceRecord {
  id: string; // Unique identifier (timestamp-based)
  productName: string; // User-defined product name
  weight: number; // Weight in grams
  price: number; // Total price in yuan
  pricePerUnit: number; // Calculated price per 500g
  timestamp: number; // Unix timestamp (milliseconds)
}

// ============================================================================
// WeightPriceConverter Types
// ============================================================================

export interface WeightPriceConverterState {
  productName: string; // Product name input
  weight: string;
  price: string;
  result: string | null;
  error: string | null;
  records: PriceRecord[]; // All saved price records
  showHistory: boolean; // History panel visibility
  successMessage: string | null; // Success feedback message
}

export interface WeightPriceConverterProps {
  // Self-contained component, no props required
}

// ============================================================================
// DiceRoller Types
// ============================================================================

export interface DiceRollerState {
  diceValue: number;
  isAnimating: boolean;
  cameraEnabled: boolean;
  cameraStream: MediaStream | null;
  handDetector: any; // HandPoseDetector from TensorFlow.js
  lastHandPosition: HandPosition | null;
  gestureInProgress: boolean;
  error: string | null;
}

export interface DiceRollerProps {
  // Self-contained component, no props required
}

// ============================================================================
// Hand Gesture Detection Types
// ============================================================================

export interface HandPosition {
  x: number;
  y: number;
}

export interface HandKeypoint {
  x: number;
  y: number;
  z: number;
  name: string;
}

export interface HandPose {
  keypoints: HandKeypoint[];
  keypoints3D: HandKeypoint[];
  handedness: string;
}

export interface GestureDetectionConfig {
  swipeThreshold: number; // pixels (default: 50)
  debounceTime: number; // milliseconds (default: 500)
  frameRate: number; // fps (default: 30)
}

export interface GestureDetectionResult {
  detected: boolean;
  gestureType: 'swipe' | 'none';
  distance: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

// ============================================================================
// Camera and Video Types
// ============================================================================

export interface CameraConfig {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
}

export interface CameraPermissionError {
  code: 'PERMISSION_DENIED' | 'NOT_SUPPORTED' | 'NOT_FOUND';
  message: string;
}

// ============================================================================
// Animation Types
// ============================================================================

export interface AnimationConfig {
  duration: number; // milliseconds
  rotations: number; // number of 360° rotations
  easing: 'linear' | 'ease-in-out';
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PriceCalculationInput {
  weight: number;
  price: number;
}

export interface PriceCalculationResult {
  pricePerUnit: number;
  formatted: string; // "XX.XX 元/斤"
}

/**
 * Animation utilities for dice roller
 */

import { AnimationConfig } from '../types';

// Default animation configuration
const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 500, // milliseconds
  rotations: 1, // 360° rotation
  easing: 'ease-in-out',
};

/**
 * Generates a CSS animation class for dice rotation
 * Creates a 360° clockwise rotation with vertical floating motion
 */
export function generateDiceAnimationClass(
  config: Partial<AnimationConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_ANIMATION_CONFIG, ...config };

  // Return Tailwind animation class name
  // The actual animation keyframes should be defined in Tailwind config
  return `animate-dice-roll-${finalConfig.duration}`;
}

/**
 * Calculates animation duration in seconds for CSS
 */
export function getAnimationDuration(durationMs: number): string {
  return `${durationMs / 1000}s`;
}

/**
 * Creates a promise that resolves after animation completes
 */
export function waitForAnimation(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

/**
 * Generates inline styles for dice animation
 * Used as fallback if Tailwind animation is not available
 */
export function generateDiceAnimationStyles(
  config: Partial<AnimationConfig> = {}
): React.CSSProperties {
  const finalConfig = { ...DEFAULT_ANIMATION_CONFIG, ...config };

  return {
    animation: `diceRoll ${finalConfig.duration}ms ${finalConfig.easing}`,
    transformOrigin: 'center',
  };
}

/**
 * Generates CSS keyframes for dice animation
 * Combines rotation with subtle vertical floating motion
 */
export function generateDiceKeyframes(rotations: number = 1): string {
  const totalDegrees = 360 * rotations;

  return `
    @keyframes diceRoll {
      0% {
        transform: rotateZ(0deg) translateY(0px);
      }
      50% {
        transform: rotateZ(${totalDegrees / 2}deg) translateY(-10px);
      }
      100% {
        transform: rotateZ(${totalDegrees}deg) translateY(0px);
      }
    }
  `;
}

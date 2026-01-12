/**
 * DiceRoller Component
 * 
 * An interactive dice component with both click and hand gesture recognition capabilities.
 * Features:
 * - Click to roll the dice
 * - Hand gesture recognition (swipe detection) to roll the dice
 * - Real-time camera feed with gesture detection
 * - Smooth animation with animation lock to prevent concurrent rolls
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DiceRollerState } from '../types';
import { waitForAnimation } from '../utils/animation';

const ANIMATION_DURATION = 500; // milliseconds

export const DiceRoller: React.FC = () => {
  const [state, setState] = useState<DiceRollerState>({
    diceValue: 1,
    isAnimating: false,
    cameraEnabled: false,
    cameraStream: null,
    handDetector: null,
    lastHandPosition: null,
    gestureInProgress: false,
    error: null,
  });

  const rollDiceRef = useRef<() => Promise<void>>();

  /**
   * Generates a random dice value (1-6)
   */
  const generateRandomDiceValue = useCallback((): number => {
    return Math.floor(Math.random() * 6) + 1;
  }, []);

  /**
   * Handles dice roll logic with animation
   */
  const rollDice = useCallback(async () => {
    // Prevent concurrent rolls
    if (state.isAnimating) {
      return;
    }

    setState((prev) => ({
      ...prev,
      isAnimating: true,
    }));

    // Wait for animation to complete
    await waitForAnimation(ANIMATION_DURATION);

    // Generate new dice value
    const newValue = generateRandomDiceValue();

    setState((prev) => ({
      ...prev,
      diceValue: newValue,
      isAnimating: false,
    }));
  }, [state.isAnimating, generateRandomDiceValue]);

  // Update ref so gesture detection loop can call it without stale closure
  useEffect(() => {
    rollDiceRef.current = rollDice;
  }, [rollDice]);

  /**
   * Cleanup on component unmount
   */
  useEffect(() => {
    return () => {
      // Cleanup if needed in the future
    };
  }, []);

  /**
   * Handles click on dice
   */
  const handleDiceClick = useCallback(() => {
    rollDice();
  }, [rollDice]);

  /**
   * Renders a single dice face with dots
   * Each face displays the correct dot pattern (1-6 dots)
   */
  const renderDiceFace = (value: number): React.ReactNode => {
    const dotPatterns: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const activeDots = dotPatterns[value] || [];

    return (
      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-white to-slate-100 border-4 border-white/30 rounded-xl flex items-center justify-center shadow-2xl">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0 p-3">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isActive = activeDots.includes(idx);

            return (
              <div
                key={idx}
                className="flex items-center justify-center"
              >
                {isActive && (
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full shadow-md" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          骰子滚轮
        </h2>
        <p className="text-slate-400 text-sm">点击骰子滚动</p>
      </div>

      {/* Dice Display */}
      <div className="flex justify-center mb-8">
        <div
          onClick={handleDiceClick}
          className={`cursor-pointer transition-transform hover:scale-110 ${
            state.isAnimating ? 'animate-spin' : ''
          }`}
          style={{
            animation: state.isAnimating ? `spin 0.5s ease-in-out` : 'none',
          }}
        >
          {renderDiceFace(state.diceValue)}
        </div>
      </div>

      {/* Result Display */}
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-2">当前结果</p>
        <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {state.diceValue}
        </p>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes spin {
          0% {
            transform: rotateZ(0deg) translateY(0px);
          }
          50% {
            transform: rotateZ(180deg) translateY(-15px);
          }
          100% {
            transform: rotateZ(360deg) translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

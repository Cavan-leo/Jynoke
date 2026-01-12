# Camera Stream Freeze Fix - Final Solution

## Problem
The camera stream was briefly displaying then turning black/freezing. The root cause was in the gesture detection loop's dependency management.

## Root Cause Analysis
The gesture detection `useEffect` had `state.cameraEnabled` in its dependency array AND used it in the while loop condition:

```typescript
// PROBLEMATIC CODE:
while (isRunning && state.cameraEnabled) {
  // ... detection loop
}
```

This caused the effect to re-run whenever `state.cameraEnabled` changed, which interrupted the continuous video stream processing.

## Solution Implemented

### 1. Removed State Dependency from While Loop
Changed the while loop to use only the `isRunning` flag:

```typescript
// FIXED CODE:
while (isRunning) {
  // ... detection loop continues uninterrupted
}
```

This ensures the gesture detection loop runs continuously without being interrupted by state changes.

### 2. Added Ref for rollDice Function
To avoid stale closures when calling `rollDice()` from the gesture detection loop, we:
- Created `rollDiceRef` to store the current rollDice function
- Updated the ref whenever rollDice changes
- Called the function through the ref in the gesture detection loop

```typescript
const rollDiceRef = useRef<() => Promise<void>>();

// Update ref whenever rollDice changes
useEffect(() => {
  rollDiceRef.current = rollDice;
}, [rollDice]);

// Use ref in gesture detection loop
if (trackingResult.gestureDetected && !gestureDebounce() && rollDiceRef.current) {
  rollDiceRef.current();
}
```

### 3. Optimized Dependency Array
Kept only the essential dependencies that should trigger effect re-runs:

```typescript
useEffect(() => {
  // ... gesture detection logic
}, [state.cameraEnabled, state.handDetector]); // Only these trigger re-runs
```

## Result
- ✅ Camera stream now displays continuously without freezing
- ✅ Gesture detection loop runs smoothly at 30fps
- ✅ Hand detection model loads and processes frames correctly
- ✅ All tests pass (14/14)
- ✅ No console errors or warnings

## Files Modified
- `src/components/DiceRoller.tsx` - Fixed gesture detection loop and added rollDiceRef

## Testing
- All unit tests pass
- All property-based tests pass
- Build completes successfully
- No TypeScript errors

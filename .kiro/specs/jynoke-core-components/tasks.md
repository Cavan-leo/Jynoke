# Implementation Plan: Jynoke Core Components

## Overview

This implementation plan breaks down the Jynoke core components into discrete TypeScript/TSX coding tasks. The approach follows a bottom-up strategy: first establish core utilities and types, then implement individual components, add property-based tests for correctness validation, and finally integrate everything together.

## Dependencies

Before starting implementation, ensure these npm packages are installed:

```bash
npm install react@18 react-dom@18 tailwindcss@latest
npm install @tensorflow/tfjs-core @tensorflow/tfjs-converter @tensorflow-models/hand-pose-detection
npm install --save-dev typescript @types/react @types/react-dom
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev fast-check
```

## Tasks

- [x] 1. Set up project structure and core types
  - Create directory structure: `src/components/`, `src/types/`, `src/utils/`
  - Define TypeScript interfaces for WeightPriceConverter state and props
  - Define TypeScript interfaces for DiceRoller state and props
  - Define TypeScript interfaces for hand gesture detection
  - _Requirements: 4.1, 4.5_

- [x] 2. Implement WeightPriceConverter component
  - [x] 2.1 Create WeightPriceConverter.tsx with state management
    - Implement useState hooks for weight, price, result, error
    - Implement input change handlers with type safety
    - _Requirements: 1.1, 1.4, 4.1_

  - [x] 2.2 Implement price calculation logic
    - Write calculatePrice() function with formula: (price / weight) * 500
    - Implement input validation (non-numeric, negative, empty checks)
    - Format result to 2 decimal places with "XX.XX 元/斤" format
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 2.3 Implement UI with Tailwind CSS
    - Create input fields with placeholder text (重量（单位：g）, 总价（单位：元）)
    - Create calculate and clear buttons with Tailwind styling
    - Implement focus border highlight effect on inputs
    - Implement button press feedback (scale animation)
    - Display error messages in red below component
    - Display result in bold, centered format
    - _Requirements: 1.5, 1.6, 4.2, 4.3_

  - [x] 2.4 Write property test for price calculation accuracy

    - **Property 1: Price Calculation Accuracy**
    - **Validates: Requirements 1.1**
    - Generate random positive weights and prices
    - Verify calculation equals (price / weight) * 500 rounded to 2 decimals
    - Minimum 100 iterations

  - [x] 2.5 Write property test for input validation

    - **Property 2: Input Validation Prevents Invalid Calculations**
    - **Validates: Requirements 1.3**
    - Generate invalid inputs (empty, non-numeric, negative)
    - Verify error message is displayed and no crash occurs
    - Minimum 100 iterations

  - [x] 2.6 Write property test for clear button

    - **Property 3: Clear Button Resets All State**
    - **Validates: Requirements 1.4**
    - Populate inputs and results
    - Click clear button
    - Verify all fields return to empty state
    - Minimum 100 iterations

- [x] 3. Implement DiceRoller component - Core structure
  - [x] 3.1 Create DiceRoller.tsx with state management
    - Implement useState hooks for diceValue, isAnimating, cameraEnabled, error
    - Implement useRef hooks for videoRef, canvasRef
    - Implement useCallback for event handlers
    - _Requirements: 2.1, 2.2, 3.1, 4.1_

  - [x] 3.2 Implement dice display with 6 faces
    - Create dice component with 80px size (desktop) / 60px (mobile)
    - Implement all 6 dice faces with correct dot patterns (1-6 dots)
    - Use white background, black dots, 4px border radius
    - Center dots using Tailwind flexbox utilities
    - _Requirements: 2.4, 2.5, 4.3_

  - [x] 3.3 Implement dice animation system
    - Create 0.5s clockwise 360° rotation animation using Tailwind
    - Add subtle vertical floating motion to rotation
    - Implement animation lock (isAnimating flag)
    - Prevent repeated clicks during animation
    - _Requirements: 2.1, 2.2_

  - [x] 3.4 Implement dice roll logic
    - Write rollDice() function that generates random 1-6
    - Trigger animation on roll
    - Update diceValue after animation completes
    - _Requirements: 2.3_

  - [x] 3.5 Write property test for dice roll range

    - **Property 4: Dice Roll Generates Valid Values**
    - **Validates: Requirements 2.3**
    - Generate 100+ dice rolls
    - Verify each result is integer 1-6
    - Verify distribution is reasonably random
    - Minimum 100 iterations

  - [x] 3.6 Write property test for animation lock

    - **Property 5: Animation Lock Prevents Concurrent Rolls**
    - **Validates: Requirements 2.2**
    - Trigger roll, immediately attempt second trigger
    - Verify second trigger is ignored
    - Verify only one animation plays
    - Minimum 100 iterations

- [ ] 4. Implement hand gesture recognition system
  - [x] 4.1 Create hand gesture detection utilities
    - Write initializeHandDetector() to load TensorFlow.js HandPose model
    - Implement hand keypoint extraction from model output
    - Calculate palm center position from wrist and middle finger base
    - _Requirements: 3.3, 3.4, 4.6_

  - [x] 4.2 Implement gesture tracking logic
    - Write trackHandPosition() to monitor palm center across frames
    - Calculate distance between consecutive positions
    - Detect Rapid_Hand_Swipe when distance > 50px
    - Implement debounce to prevent repeated triggers within 500ms
    - _Requirements: 3.4, 3.6_

  - [x] 4.3 Integrate camera stream management
    - Implement enableCamera() to request permissions and start video stream
    - Implement disableCamera() to stop stream and cleanup resources
    - Handle camera permission errors with friendly messages
    - Display real-time video feed (max 400px width, 4px radius)
    - _Requirements: 3.1, 3.2, 3.5, 3.7_

  - [x] 4.4 Integrate gesture detection with dice roller
    - Connect hand detection to dice roll trigger
    - Use shared animation lock with click trigger
    - Prevent repeated gesture triggers during animation
    - _Requirements: 3.4, 3.6_

  - [ ]* 4.5 Write property test for gesture detection
    - **Property 6: Hand Gesture Detection Triggers Roll**
    - **Validates: Requirements 3.4**
    - Generate hand positions with > 50px movement
    - Verify gesture is detected and roll is triggered
    - Generate hand positions with < 50px movement
    - Verify gesture is not detected
    - Minimum 100 iterations

  - [ ]* 4.6 Write property test for camera resource cleanup
    - **Property 7: Camera Resource Cleanup**
    - **Validates: Requirements 3.5**
    - Enable camera, then disable it
    - Verify stream is stopped and resources are released
    - Verify no memory leaks from repeated enable/disable cycles
    - Minimum 100 iterations

- [ ] 5. Implement UI integration and styling
  - [x] 5.1 Create main container layout
    - Implement vertical stacking with 20px spacing between modules
    - Center alignment with appropriate padding
    - Responsive layout for mobile and desktop
    - _Requirements: 4.3, 4.7_

  - [x] 5.2 Integrate WeightPriceConverter into main layout
    - Add WeightPriceConverter component to container
    - Ensure responsive width (100% mobile, max 400px desktop)
    - _Requirements: 1.2, 4.3_

  - [x] 5.3 Integrate DiceRoller into main layout
    - Add DiceRoller component to container
    - Add camera enable/disable buttons
    - Add camera feed display area (conditional)
    - Ensure responsive sizing (60px mobile, 80px desktop)
    - _Requirements: 2.4, 3.1, 3.7, 4.3_

  - [ ]* 5.4 Write property test for responsive layout
    - **Property 8: Responsive Layout Adaptation**
    - **Validates: Requirements 4.3**
    - Test component at mobile viewport (375px)
    - Test component at desktop viewport (1920px)
    - Verify inputs are 100% width on mobile, max 400px on desktop
    - Verify dice is 60px on mobile, 80px on desktop
    - Minimum 100 iterations

- [x] 6. Checkpoint - Ensure all tests pass
  - Run all unit tests and property-based tests
  - Verify no console errors or warnings
  - Ensure all components render without crashes
  - Ask the user if questions arise

- [ ] 7. Add error handling and edge cases
  - [x] 7.1 Implement error boundaries
    - Add error handling for TensorFlow.js model loading failures
    - Add error handling for camera permission denials
    - Display friendly error messages for all error scenarios
    - _Requirements: 3.2, 3.3_

  - [x] 7.2 Add input sanitization
    - Trim whitespace from inputs
    - Handle very large numbers gracefully
    - Handle very small numbers (near zero) gracefully
    - _Requirements: 1.3_

  - [x] 7.3 Add resource cleanup on unmount
    - Implement useEffect cleanup for camera streams
    - Implement useEffect cleanup for animation timers
    - Implement useEffect cleanup for hand detection model
    - _Requirements: 3.5, 4.1_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Run all unit tests and property-based tests
  - Verify responsive layout at multiple viewport sizes
  - Verify all error scenarios display friendly messages
  - Verify no memory leaks or resource leaks
  - Ask the user if questions arise

- [ ] 9. Documentation and code review
  - [x] 9.1 Add inline comments to key logic
    - Comment price calculation formula
    - Comment hand gesture detection logic
    - Comment animation system
    - Comment camera permission handling
    - _Requirements: 4.4_

  - [x] 9.2 Create README with setup instructions
    - Document npm dependencies
    - Document how to run tests
    - Document component usage examples
    - _Requirements: 5.1, 5.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All styling uses Tailwind CSS with no external CSS files
- Components use React 18 Hooks (useState, useEffect, useCallback)
- Hand gesture detection uses TensorFlow.js HandPose model
- Camera stream management includes proper resource cleanup


# Design Document: Jynoke Core Components

## Overview

The Jynoke core components consist of two main React functional components built with React 18 Hooks and Tailwind CSS:

1. **WeightPriceConverter** - A utility component for calculating price per unit weight
2. **DiceRoller** - An interactive dice component with both click and hand gesture recognition capabilities

The design emphasizes clean, maintainable code using modern React patterns (useState, useEffect, useCallback) with TensorFlow.js integration for hand pose detection. All styling uses Tailwind CSS for responsive, mobile-first design.

## Architecture

### Component Structure

```
JynokeApp (Container)
├── WeightPriceConverter
│   ├── Input Fields (weight, price)
│   ├── Calculate Button
│   ├── Clear Button
│   └── Result Display
└── DiceRoller
    ├── Dice Display (6-sided)
    ├── Camera Controls (Enable/Disable)
    ├── Camera Feed (conditional)
    ├── Hand Gesture Detector (conditional)
    └── Animation System
```

### Data Flow

**WeightPriceConverter**:
- User inputs weight (grams) and price (yuan)
- On calculate: validate inputs → compute price per 500g → display result
- On clear: reset all state to initial values
- Error state: display validation errors without component crash

**DiceRoller**:
- Click trigger: animate dice → generate random 1-6 → display result
- Gesture trigger: detect hand swipe → animate dice → generate random 1-6 → display result
- Camera state: manage webcam stream, hand detection model, gesture tracking
- Shared animation lock: prevent concurrent rolls from click and gesture

## Components and Interfaces

### WeightPriceConverter Component

**Props**: None (self-contained)

**State**:
```javascript
{
  weight: string,           // Input weight in grams
  price: string,            // Input price in yuan
  result: string | null,    // Calculated price per 500g
  error: string | null      // Validation error message
}
```

**Key Functions**:
- `calculatePrice()`: Validates inputs and computes (price / weight) * 500
- `clearInputs()`: Resets all state to initial values
- `validateInputs()`: Checks for non-numeric, negative, or empty values

**Styling**:
- Container: centered, vertical layout, 20px padding
- Input fields: 100% width on mobile, max 400px on desktop, focus border highlight
- Buttons: Tailwind button styles with hover/active states
- Error message: red text, displayed below component
- Result: bold, centered, "XX.XX 元/斤" format

### DiceRoller Component

**Props**: None (self-contained)

**State**:
```javascript
{
  diceValue: number,              // Current dice display (1-6)
  isAnimating: boolean,           // Animation in progress
  cameraEnabled: boolean,         // Camera stream active
  cameraStream: MediaStream | null,
  handDetector: HandPoseDetector | null,
  videoRef: React.RefObject,
  canvasRef: React.RefObject,
  lastHandPosition: {x, y} | null,
  gestureInProgress: boolean,     // Prevent repeated gesture triggers
  error: string | null            // Camera permission or setup errors
}
```

**Key Functions**:
- `rollDice()`: Trigger animation and generate random 1-6
- `animateDice()`: 0.5s rotation + floating animation
- `enableCamera()`: Request permissions, initialize video stream
- `disableCamera()`: Stop stream, cleanup resources
- `detectHandGesture()`: Monitor hand position, detect 50px+ swipe
- `handleGestureDetection()`: Trigger roll on swipe detection

**Styling**:
- Dice: 80px (desktop) / 60px (mobile), white bg, black dots, 4px radius
- Camera feed: max 400px width, 4px radius, centered
- Buttons: Tailwind styles with hover effects
- Error message: friendly text, red color

## Data Models

### Price Calculation Formula

```
Price_Per_Unit = (Total_Price / Weight_In_Grams) * 500
Result = Price_Per_Unit.toFixed(2) + " 元/斤"
```

### Dice Display (6-sided)

Each face displays dots in standard dice pattern:
- Face 1: 1 dot (center)
- Face 2: 2 dots (diagonal)
- Face 3: 3 dots (diagonal line)
- Face 4: 4 dots (corners)
- Face 5: 5 dots (corners + center)
- Face 6: 6 dots (2 columns of 3)

### Hand Gesture Detection

**Input**: Hand pose keypoints from TensorFlow.js HandPose model
**Detection Logic**:
- Track palm center position across frames
- Calculate distance between consecutive positions
- If distance > 50px in single frame: trigger swipe gesture
- Debounce: prevent repeated triggers within 500ms

**Hand Pose Model**:
- Uses @tensorflow-models/hand-pose-detection
- Detects 21 hand keypoints
- Palm center calculated from wrist and middle finger base

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Price Calculation Accuracy

**For any** valid weight (positive number) and price (positive number), the calculated price per unit weight should equal (price / weight) * 500, rounded to exactly 2 decimal places.

**Validates: Requirements 1.1**

### Property 2: Input Validation Prevents Invalid Calculations

**For any** invalid input (non-numeric string, negative number, or empty string), the component should reject the calculation and display an error message without crashing or producing a result.

**Validates: Requirements 1.3**

### Property 3: Clear Button Resets All State

**For any** state where inputs and results are populated, clicking the clear button should reset all input fields to empty strings and clear the result display.

**Validates: Requirements 1.4**

### Property 4: Dice Roll Generates Valid Values

**For any** dice roll (triggered by click or gesture), the resulting Dice_State should be a random integer between 1 and 6 (inclusive).

**Validates: Requirements 2.3**

### Property 5: Animation Lock Prevents Concurrent Rolls

**For any** active animation, attempting to trigger a new roll (via click or gesture) should be ignored until the current animation completes.

**Validates: Requirements 2.2, 3.6**

### Property 6: Hand Gesture Detection Triggers Roll

**For any** detected Rapid_Hand_Swipe gesture (palm movement > 50px), the component should automatically trigger a dice roll with the same animation and result generation as a click trigger.

**Validates: Requirements 3.4**

### Property 7: Camera Resource Cleanup

**For any** active camera stream, clicking the disable button should stop the stream, release all camera resources, and prevent further gesture detection.

**Validates: Requirements 3.5**

### Property 8: Responsive Layout Adaptation

**For any** viewport size, the component should adapt: mobile (100% width inputs, 60px dice), desktop (max 400px width, 80px dice), with no layout breakage.

**Validates: Requirements 1.2, 2.4, 3.7, 4.3**

## Error Handling

### WeightPriceConverter Errors

1. **Empty Input**: Display "请输入重量和价格" (Please enter weight and price)
2. **Non-numeric Input**: Display "请输入有效的数字" (Please enter valid numbers)
3. **Negative Values**: Display "重量和价格必须为正数" (Weight and price must be positive)
4. **Zero Weight**: Display "重量不能为零" (Weight cannot be zero)

### DiceRoller Errors

1. **Camera Permission Denied**: Display "摄像头权限被拒绝，请检查浏览器设置" (Camera permission denied, check browser settings)
2. **Camera Not Available**: Display "您的设备不支持摄像头" (Your device does not support camera)
3. **Hand Detection Model Load Failed**: Display "手势识别模型加载失败，请刷新页面" (Hand detection model failed to load, please refresh)

## Testing Strategy

### Unit Tests

Unit tests verify specific examples and edge cases:

1. **WeightPriceConverter**:
   - Valid calculation: weight=500g, price=100 yuan → result="100.00 元/斤"
   - Edge case: weight=1g, price=0.01 yuan → result="0.50 元/斤"
   - Error case: empty weight field → error message displayed
   - Error case: negative price → error message displayed
   - Clear button: resets all fields to empty

2. **DiceRoller**:
   - Click trigger: generates value 1-6
   - Animation lock: second click during animation is ignored
   - Camera enable: requests permissions and displays video feed
   - Camera disable: stops stream and hides video feed
   - Gesture detection: swipe > 50px triggers roll

### Property-Based Tests

Property-based tests verify universal properties across many generated inputs:

1. **Price Calculation Property** (Property 1):
   - Generate random positive weights and prices
   - Verify calculation formula: (price / weight) * 500
   - Verify result has exactly 2 decimal places
   - Minimum 100 iterations

2. **Input Validation Property** (Property 2):
   - Generate invalid inputs: empty strings, non-numeric, negative numbers
   - Verify error message is displayed
   - Verify no result is calculated
   - Minimum 100 iterations

3. **Dice Roll Range Property** (Property 4):
   - Generate 100+ dice rolls
   - Verify each result is integer 1-6
   - Verify distribution is reasonably random

4. **Animation Lock Property** (Property 5):
   - Trigger roll, immediately attempt second trigger
   - Verify second trigger is ignored
   - Verify only one animation plays

5. **Gesture Detection Property** (Property 6):
   - Generate hand positions with > 50px movement
   - Verify gesture is detected and roll is triggered
   - Generate hand positions with < 50px movement
   - Verify gesture is not detected

6. **Responsive Layout Property** (Property 8):
   - Test component at mobile viewport (375px)
   - Test component at desktop viewport (1920px)
   - Verify inputs are 100% width on mobile, max 400px on desktop
   - Verify dice is 60px on mobile, 80px on desktop

### Test Configuration

- **Framework**: Jest + React Testing Library for unit tests
- **Property Testing**: fast-check for property-based tests
- **Minimum iterations**: 100 per property test
- **Coverage target**: >90% for core logic


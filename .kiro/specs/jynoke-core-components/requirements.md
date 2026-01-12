# Requirements Document: Jynoke Core Components

## Introduction

Jynoke is a personal tool aggregation project built with React 18, featuring a weight-price converter and a dice roller with gesture recognition capabilities. This document specifies the core React components that power these tools, with emphasis on hand gesture detection using TensorFlow.js.

## Glossary

- **Weight_Price_Converter**: Component that calculates price per unit weight (per 500g)
- **Dice_Roller**: Component that simulates a 6-sided dice with click and gesture-based triggers
- **Hand_Gesture_Detector**: TensorFlow.js-based system that detects hand movements from camera feed
- **Rapid_Hand_Swipe**: A hand gesture defined as palm movement exceeding 50px distance
- **Price_Per_Unit**: Calculated value representing cost per 500g (per 斤)
- **Dice_State**: Current display value of the dice (1-6)
- **Camera_Feed**: Real-time video stream from user's webcam

## Requirements

### Requirement 1: Weight-Price Converter Component

**User Story:** As a user, I want to convert total price and weight into price per unit weight, so that I can compare product costs effectively.

#### Acceptance Criteria

1. WHEN the user enters a valid weight in grams and total price in yuan, THE Weight_Price_Converter SHALL calculate the Price_Per_Unit (per 500g) with 2 decimal places
2. WHEN the user clicks the calculate button, THE Weight_Price_Converter SHALL display the result in format "XX.XX 元/斤"
3. WHEN the user enters invalid input (non-numeric, negative, or empty values), THE Weight_Price_Converter SHALL display a red error message below the component without crashing
4. WHEN the user clicks the clear button, THE Weight_Price_Converter SHALL reset all input fields and clear the result display
5. WHEN an input field receives focus, THE Weight_Price_Converter SHALL apply a subtle border highlight effect
6. WHEN the user clicks the calculate button, THE button SHALL show a brief press feedback (subtle scale animation)

### Requirement 2: Dice Roller Component - Click Interaction

**User Story:** As a user, I want to roll a dice by clicking it, so that I can generate random numbers for games.

#### Acceptance Criteria

1. WHEN the user clicks the dice, THE Dice_Roller SHALL trigger a 0.5s clockwise 360° rotation animation combined with subtle vertical floating motion
2. WHEN the dice is animating, THE Dice_Roller SHALL prevent repeated clicks from triggering additional rolls
3. WHEN the animation completes, THE Dice_Roller SHALL display a random Dice_State value (1-6) and remain fixed
4. THE Dice_Roller SHALL display as a 6-sided dice with white background, black dots, 4px border radius, and 80px size on desktop (60px on mobile)
5. WHEN the Dice_Roller is displayed, THE dots SHALL be centered and visually clean

### Requirement 3: Dice Roller Component - Hand Gesture Recognition

**User Story:** As a user, I want to roll the dice using hand gestures, so that I can interact with the application hands-free.

#### Acceptance Criteria

1. WHEN the user clicks the "Enable Camera Gesture Recognition" button, THE Dice_Roller SHALL request camera permissions and display a real-time Camera_Feed below the component
2. WHEN camera permissions are denied, THE Dice_Roller SHALL display a friendly error message instead of the Camera_Feed
3. WHEN the Camera_Feed is active, THE Dice_Roller SHALL use Hand_Gesture_Detector to monitor for Rapid_Hand_Swipe gestures
4. WHEN a Rapid_Hand_Swipe gesture is detected (palm movement exceeding 50px), THE Dice_Roller SHALL automatically trigger a dice roll
5. WHEN the user clicks the "Disable Camera" button, THE Dice_Roller SHALL stop the Camera_Feed and release camera resources
6. WHEN a gesture triggers a roll, THE Dice_Roller SHALL prevent repeated gesture triggers during animation using shared prevention logic with click triggers
7. THE Camera_Feed display SHALL not exceed 400px width, have 4px border radius, and integrate seamlessly with component layout

### Requirement 4: Technical Implementation

**User Story:** As a developer, I want the components to use modern React patterns and TensorFlow.js for ML capabilities, so that the code is maintainable and performant.

#### Acceptance Criteria

1. THE components SHALL be implemented as React functional components using Hooks (useState, useEffect, useCallback)
2. ALL styling SHALL use Tailwind CSS with no external CSS files
3. THE layout SHALL be responsive, adapting to mobile (100% width inputs, 60px dice) and desktop (max 400px width, 80px dice)
4. THE Hand_Gesture_Detector initialization and key logic SHALL include single-line comments for maintainability
5. THE components SHALL isolate state internally with no external global variables
6. THE gesture recognition and dice logic SHALL be decoupled and independently testable
7. THE overall layout SHALL use vertical stacking with 20px spacing between modules, centered alignment, and appropriate padding

### Requirement 5: Dependencies and Setup

**User Story:** As a developer, I want clear documentation of all required npm dependencies, so that I can set up the project correctly.

#### Acceptance Criteria

1. THE project SHALL explicitly list all required npm packages including @tensorflow/tfjs-core, @tensorflow/tfjs-converter, and @tensorflow-models/hand-pose-detection
2. WHEN the project is initialized, THE developer SHALL be able to install all dependencies with a single npm install command
3. THE component SHALL work with React 18 and Tailwind CSS as specified


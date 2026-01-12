# Implementation Plan: Price History & Product Naming Feature

## Overview

This implementation plan breaks down the price history feature into discrete TypeScript/TSX coding tasks. The approach follows a bottom-up strategy: first update types and utilities, then enhance the component with history functionality, add tests, and finally integrate the UI.

## Tasks

- [ ] 1. Update TypeScript types and interfaces
  - Add PriceRecord interface to src/types/index.ts
  - Add WeightPriceConverterState with history fields
  - Add type definitions for history operations
  - _Requirements: 8.3_

- [ ] 2. Create history utility functions
  - [ ] 2.1 Create src/utils/history.ts with core functions
    - Write getRecordsFromStorage() to load from LocalStorage
    - Write saveRecordsToStorage() to persist records
    - Write generateRecordId() to create unique IDs
    - Write formatTimestamp() to format dates
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 2.2 Write property test for record persistence
    - **Property 1: Record Persistence**
    - **Validates: Requirements 2.2, 7.1, 7.2**
    - Generate random records, save to storage, retrieve and verify
    - Minimum 100 iterations

  - [ ]* 2.3 Write property test for record uniqueness
    - **Property 2: Record Uniqueness**
    - **Validates: Requirements 2.1**
    - Generate multiple records, verify all IDs are unique
    - Minimum 100 iterations

- [ ] 3. Enhance WeightPriceConverter component - State Management
  - [ ] 3.1 Add product name input field
    - Add productName state to component
    - Create input field with max 50 characters
    - Clear productName when clear button clicked
    - _Requirements: 1.1, 1.2, 1.5_

  - [ ] 3.2 Add history state management
    - Add records state to store all saved records
    - Add showHistory state for panel visibility
    - Add successMessage state for feedback
    - Load records from LocalStorage on component mount
    - _Requirements: 2.1, 3.1, 7.1_

  - [ ] 3.3 Implement save record functionality
    - Write saveRecord() function
    - Validate that result exists before saving
    - Create PriceRecord object with all fields
    - Save to state and LocalStorage
    - Display success message
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 3.4 Implement load record functionality
    - Write loadRecord(id) function
    - Populate productName, weight, price fields
    - Recalculate result
    - Close history panel
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [ ] 3.5 Implement delete record functionality
    - Write deleteRecord(id) function
    - Remove from state and LocalStorage
    - Update history list immediately
    - _Requirements: 4.2, 4.3_

  - [ ] 3.6 Implement clear all records functionality
    - Write clearAllRecords() function
    - Show confirmation dialog
    - Delete all records on confirmation
    - Update history display
    - _Requirements: 4.4, 4.5_

- [ ] 4. Enhance WeightPriceConverter component - UI
  - [ ] 4.1 Add product name input field to UI
    - Create input field with placeholder "商品名称（可选）"
    - Add label "商品名称"
    - Apply Tailwind styling consistent with other inputs
    - Add max length validation (50 characters)
    - _Requirements: 1.1, 1.4, 6.1_

  - [ ] 4.2 Add save record button
    - Create "保存记录" button next to calculate button
    - Apply gradient styling consistent with design
    - Add click handler to saveRecord()
    - _Requirements: 2.1, 6.1_

  - [ ] 4.3 Add view history button
    - Create "查看历史" button next to save button
    - Apply gradient styling
    - Add click handler to toggle history panel
    - _Requirements: 3.1, 6.1_

  - [ ] 4.4 Implement history panel UI
    - Create history panel component with glassmorphic styling
    - Add semi-transparent overlay
    - Implement slide-in animation from right (0.3s)
    - Add close button (X icon)
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ] 4.5 Implement history list display
    - Create record item component
    - Display product name, weight, price, price per unit
    - Display formatted timestamp
    - Add load and delete buttons to each record
    - Sort records by timestamp (newest first)
    - _Requirements: 3.2, 3.3, 3.5, 6.5, 6.6_

  - [ ] 4.6 Implement empty state message
    - Display "暂无记录" when history is empty
    - Center message with appropriate styling
    - _Requirements: 3.4_

  - [ ] 4.7 Add clear all button to history panel
    - Create "清空历史" button at bottom of panel
    - Add confirmation dialog
    - Delete all records on confirmation
    - _Requirements: 4.4, 4.5_

  - [ ] 4.8 Add success message display
    - Show "记录已保存" after saving
    - Auto-hide after 2 seconds
    - Use fade-in/fade-out animation
    - _Requirements: 2.3_

- [ ] 5. Add error handling
  - [ ] 5.1 Handle LocalStorage errors
    - Catch LocalStorage quota exceeded errors
    - Display "存储空间已满，请删除一些记录"
    - Catch LocalStorage unavailable errors
    - Display "无法保存记录，请检查浏览器设置"
    - _Requirements: 7.4, 7.5_

  - [ ] 5.2 Handle save without result
    - Validate result exists before saving
    - Display "请先计算结果后再保存"
    - _Requirements: 2.5_

  - [ ] 5.3 Handle load/delete errors
    - Handle record not found errors
    - Display "记录不存在或已被删除"
    - Handle corrupted record data
    - Display "记录数据损坏，无法加载"
    - _Requirements: Error Handling section_

- [ ] 6. Write unit tests
  - [ ]* 6.1 Write tests for save record
    - Test valid record saves correctly
    - Test record contains all required fields
    - Test success message displays
    - Test error when no result
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 6.2 Write tests for load record
    - Test record data populates fields
    - Test result recalculates
    - Test history panel closes
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [ ]* 6.3 Write tests for delete record
    - Test record removed from list
    - Test record removed from LocalStorage
    - Test list updates immediately
    - _Requirements: 4.2, 4.3_

  - [ ]* 6.4 Write tests for clear all
    - Test all records deleted
    - Test empty state displays
    - Test confirmation required
    - _Requirements: 4.4, 4.5_

  - [ ]* 6.5 Write tests for history display
    - Test records sorted by timestamp (newest first)
    - Test timestamps formatted correctly
    - Test empty state displays when no records
    - _Requirements: 3.2, 3.3, 3.4_

- [ ] 7. Write property-based tests
  - [ ]* 7.1 Write property test for record persistence
    - **Property 1: Record Persistence**
    - **Validates: Requirements 2.2, 7.1, 7.2**
    - Generate random records, save, retrieve, verify
    - Minimum 100 iterations

  - [ ]* 7.2 Write property test for record uniqueness
    - **Property 2: Record Uniqueness**
    - **Validates: Requirements 2.1**
    - Generate multiple records, verify unique IDs
    - Minimum 100 iterations

  - [ ]* 7.3 Write property test for history ordering
    - **Property 3: History Ordering**
    - **Validates: Requirements 3.2**
    - Generate records with random timestamps
    - Verify sorted by timestamp descending
    - Minimum 100 iterations

  - [ ]* 7.4 Write property test for delete removes record
    - **Property 4: Delete Removes Record**
    - **Validates: Requirements 4.2, 4.3**
    - Save multiple records, delete one, verify not in list
    - Minimum 100 iterations

  - [ ]* 7.5 Write property test for load restores data
    - **Property 5: Load Restores Data**
    - **Validates: Requirements 5.2, 5.3**
    - Save record with random data, load, verify fields match
    - Minimum 100 iterations

  - [ ]* 7.6 Write property test for clear all removes all
    - **Property 6: Clear All Removes All**
    - **Validates: Requirements 4.4, 4.5**
    - Save multiple records, clear all, verify empty
    - Minimum 100 iterations

  - [ ]* 7.7 Write property test for product name validation
    - **Property 7: Product Name Validation**
    - **Validates: Requirements 1.4**
    - Generate product names of various lengths
    - Verify names ≤ 50 characters
    - Minimum 100 iterations

  - [ ]* 7.8 Write property test for empty state handling
    - **Property 8: Empty State Handling**
    - **Validates: Requirements 3.4**
    - With 0 records, verify empty state displays
    - With 1+ records, verify list displays
    - Minimum 100 iterations

- [ ] 8. Checkpoint - Ensure all tests pass
  - Run all unit tests and property-based tests
  - Verify no console errors or warnings
  - Verify history feature works end-to-end
  - Ask the user if questions arise

- [ ] 9. Integration and final verification
  - [ ] 9.1 Verify responsive design
    - Test history panel on mobile (375px)
    - Test history panel on desktop (1920px)
    - Verify buttons and inputs are accessible
    - _Requirements: 6.1, 6.2_

  - [ ] 9.2 Verify LocalStorage persistence
    - Save records, refresh page, verify records still there
    - Test with 50+ records
    - Test with large product names
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 9.3 Verify error handling
    - Test all error scenarios
    - Verify error messages display correctly
    - Verify app doesn't crash on errors
    - _Requirements: Error Handling section_

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Run all unit tests and property-based tests
  - Verify build successful
  - Verify no TypeScript errors
  - Verify responsive layout at multiple viewport sizes
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All styling uses Tailwind CSS with no external CSS files
- Components use React 18 Hooks (useState, useEffect, useCallback)
- LocalStorage is used for data persistence across sessions
- Maximum 50 characters for product names
- Records sorted by timestamp (newest first)


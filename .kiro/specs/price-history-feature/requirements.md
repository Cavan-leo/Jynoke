# Requirements Document: Price History & Product Naming Feature

## Introduction

Enhancement to the Weight-Price Converter component that allows users to name products and save price comparison records. Users can build a personal price database to track and compare product costs over time.

## Glossary

- **Product_Name**: User-defined name for a product (e.g., "咖啡", "茶叶")
- **Price_Record**: A saved conversion entry containing product name, weight, price, calculated price per unit, and timestamp
- **History_List**: Collection of all saved price records
- **Price_Per_Unit**: Calculated value representing cost per 500g (per 斤)
- **LocalStorage**: Browser's persistent storage for saving records across sessions

## Requirements

### Requirement 1: Product Naming

**User Story:** As a user, I want to name products when calculating their price per unit, so that I can track different items separately.

#### Acceptance Criteria

1. WHEN the user enters a product name in the input field, THE Weight_Price_Converter SHALL accept and display the name
2. WHEN the user leaves the product name field empty, THE Weight_Price_Converter SHALL allow calculation without a name (use default name like "未命名商品")
3. WHEN the user enters a product name, THE name SHALL be displayed in the result and history records
4. THE product name input field SHALL have a maximum length of 50 characters
5. WHEN the user clears the form, THE product name field SHALL also be cleared

### Requirement 2: Save Price Records

**User Story:** As a user, I want to save price comparison records, so that I can build a personal price database.

#### Acceptance Criteria

1. WHEN the user clicks a "保存记录" (Save Record) button after calculation, THE Weight_Price_Converter SHALL save the record to LocalStorage
2. WHEN a record is saved, THE system SHALL capture: product name, weight, price, calculated price per unit, and timestamp
3. WHEN a record is saved, THE system SHALL display a success message (e.g., "记录已保存")
4. WHEN the user saves a record, THE record SHALL persist across browser sessions (using LocalStorage)
5. WHEN the user saves a record without a calculation result, THE system SHALL display an error message

### Requirement 3: View History Records

**User Story:** As a user, I want to view all my saved price records, so that I can compare prices and track trends.

#### Acceptance Criteria

1. WHEN the user clicks a "查看历史" (View History) button, THE Weight_Price_Converter SHALL display a history panel with all saved records
2. WHEN the history panel is displayed, THE records SHALL be sorted by timestamp (newest first)
3. WHEN viewing history, EACH record SHALL display: product name, weight, price, price per unit, and formatted timestamp
4. WHEN the history panel is empty, THE system SHALL display a friendly message (e.g., "暂无记录")
5. WHEN the user clicks the history button again, THE history panel SHALL toggle closed

### Requirement 4: Delete Records

**User Story:** As a user, I want to delete individual records or clear all history, so that I can manage my price database.

#### Acceptance Criteria

1. WHEN viewing history, EACH record SHALL have a delete button (trash icon)
2. WHEN the user clicks the delete button on a record, THE system SHALL remove that record from history and LocalStorage
3. WHEN a record is deleted, THE history list SHALL update immediately
4. WHEN the user clicks a "清空历史" (Clear All) button, THE system SHALL delete all records after confirmation
5. WHEN the user confirms clearing all history, THE history panel SHALL display the empty state message

### Requirement 5: Load Record into Converter

**User Story:** As a user, I want to load a saved record back into the converter, so that I can quickly recalculate or modify it.

#### Acceptance Criteria

1. WHEN viewing history, EACH record SHALL have a "加载" (Load) button
2. WHEN the user clicks the load button, THE system SHALL populate the converter fields with that record's data
3. WHEN a record is loaded, THE product name, weight, and price fields SHALL be filled
4. WHEN a record is loaded, THE result SHALL be recalculated and displayed
5. WHEN a record is loaded, THE history panel SHALL close automatically

### Requirement 6: UI/UX for History Feature

**User Story:** As a user, I want a clean and intuitive interface for managing price records, so that I can easily save and view my data.

#### Acceptance Criteria

1. THE history button SHALL be prominently displayed in the converter component
2. THE history panel SHALL slide in from the right side with smooth animation
3. THE history panel SHALL have a semi-transparent overlay that closes the panel when clicked
4. WHEN the history panel is open, THE main converter area SHALL remain visible but slightly dimmed
5. THE history records SHALL be displayed in a scrollable list with clear visual separation between items
6. EACH record SHALL display a timestamp in human-readable format (e.g., "2024-01-12 14:30")

### Requirement 7: Data Persistence

**User Story:** As a user, I want my price records to be saved automatically, so that I don't lose my data.

#### Acceptance Criteria

1. WHEN the application loads, THE system SHALL retrieve all saved records from LocalStorage
2. WHEN a record is saved, THE system SHALL immediately persist it to LocalStorage
3. WHEN a record is deleted, THE system SHALL immediately update LocalStorage
4. THE system SHALL handle LocalStorage quota limits gracefully (max ~5MB in most browsers)
5. WHEN LocalStorage is full, THE system SHALL display a warning message

### Requirement 8: Technical Implementation

**User Story:** As a developer, I want the history feature to use modern React patterns and maintain code quality, so that the code is maintainable.

#### Acceptance Criteria

1. THE history feature SHALL use React Hooks (useState, useEffect, useCallback)
2. THE history data SHALL be stored in component state and synced with LocalStorage
3. THE system SHALL use TypeScript interfaces for type safety
4. THE history feature SHALL include error handling for LocalStorage failures
5. THE component SHALL remain responsive with large numbers of records (100+)


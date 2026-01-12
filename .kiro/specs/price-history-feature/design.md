# Design Document: Price History & Product Naming Feature

## Overview

Enhancement to the Weight-Price Converter component that adds product naming and price record history management. Users can name products, save conversion records to LocalStorage, view history, and manage their personal price database.

## Architecture

### Component Structure

```
WeightPriceConverter (Enhanced)
├── Product Name Input
├── Weight Input
├── Price Input
├── Calculate Button
├── Clear Button
├── Save Record Button (NEW)
├── View History Button (NEW)
├── Result Display
└── History Panel (NEW)
    ├── History List
    │   └── Record Item (repeating)
    │       ├── Product Name
    │       ├── Weight & Price
    │       ├── Price Per Unit
    │       ├── Timestamp
    │       ├── Load Button
    │       └── Delete Button
    ├── Clear All Button
    └── Empty State Message
```

### Data Flow

**Save Record Flow**:
1. User enters product name, weight, price
2. User clicks calculate → result displayed
3. User clicks "Save Record" → record saved to state + LocalStorage
4. Success message displayed
5. Record appears in history

**Load Record Flow**:
1. User views history
2. User clicks "Load" on a record
3. Record data populates converter fields
4. Result recalculated and displayed
5. History panel closes

**Delete Record Flow**:
1. User views history
2. User clicks delete button on record
3. Record removed from state + LocalStorage
4. History list updates immediately

## Components and Interfaces

### Enhanced WeightPriceConverter State

```typescript
interface PriceRecord {
  id: string;                    // Unique identifier (timestamp-based)
  productName: string;           // User-defined product name
  weight: number;                // Weight in grams
  price: number;                 // Total price in yuan
  pricePerUnit: number;          // Calculated price per 500g
  timestamp: number;             // Unix timestamp
}

interface WeightPriceConverterState {
  productName: string;           // Current product name input
  weight: string;                // Current weight input
  price: string;                 // Current price input
  result: string | null;         // Calculated result
  error: string | null;          // Error message
  records: PriceRecord[];         // All saved records
  showHistory: boolean;          // History panel visibility
  successMessage: string | null; // Success feedback
}
```

### Key Functions

**Record Management**:
- `saveRecord()`: Save current calculation to history
- `loadRecord(id)`: Load record data into converter
- `deleteRecord(id)`: Delete single record
- `clearAllRecords()`: Delete all records with confirmation
- `getRecordsFromStorage()`: Load records from LocalStorage on mount
- `syncToStorage()`: Save records to LocalStorage

**UI Helpers**:
- `formatTimestamp(timestamp)`: Format timestamp to readable date/time
- `generateRecordId()`: Generate unique ID for records
- `toggleHistory()`: Show/hide history panel

## Data Models

### Price Record Structure

```typescript
{
  id: "1705070400000",
  productName: "咖啡",
  weight: 500,
  price: 100,
  pricePerUnit: 100.00,
  timestamp: 1705070400000
}
```

### LocalStorage Schema

```typescript
// Key: "jynoke_price_records"
// Value: JSON array of PriceRecord objects
[
  {
    id: "1705070400000",
    productName: "咖啡",
    weight: 500,
    price: 100,
    pricePerUnit: 100.00,
    timestamp: 1705070400000
  },
  // ... more records
]
```

### Timestamp Format

- **Storage**: Unix timestamp (milliseconds)
- **Display**: "2024-01-12 14:30" (YYYY-MM-DD HH:mm)

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do.

### Property 1: Record Persistence

**For any** saved price record, retrieving records from LocalStorage should return an equivalent record with all fields intact.

**Validates: Requirements 2.2, 7.1, 7.2**

### Property 2: Record Uniqueness

**For any** two saved records, they should have unique IDs (timestamps) to prevent data loss or overwrites.

**Validates: Requirements 2.1**

### Property 3: History Ordering

**For any** history list with multiple records, records should be sorted by timestamp in descending order (newest first).

**Validates: Requirements 3.2**

### Property 4: Delete Removes Record

**For any** saved record, after deletion, retrieving records from LocalStorage should not contain that record.

**Validates: Requirements 4.2, 4.3**

### Property 5: Load Restores Data

**For any** saved record, loading it should populate all converter fields with the exact same values (product name, weight, price).

**Validates: Requirements 5.2, 5.3**

### Property 6: Clear All Removes All

**For any** history with N records, after clearing all, the history should be empty (0 records).

**Validates: Requirements 4.4, 4.5**

### Property 7: Product Name Validation

**For any** product name input, if it exceeds 50 characters, the system should truncate or reject it.

**Validates: Requirements 1.4**

### Property 8: Empty State Handling

**For any** empty history, the system should display the empty state message instead of an empty list.

**Validates: Requirements 3.4**

## Error Handling

### Save Record Errors

1. **No Calculation Result**: Display "请先计算结果后再保存" (Calculate first before saving)
2. **LocalStorage Full**: Display "存储空间已满，请删除一些记录" (Storage full, delete some records)
3. **LocalStorage Unavailable**: Display "无法保存记录，请检查浏览器设置" (Cannot save, check browser settings)

### Load Record Errors

1. **Record Not Found**: Display "记录不存在或已被删除" (Record not found or deleted)
2. **Invalid Record Data**: Display "记录数据损坏，无法加载" (Record corrupted, cannot load)

### Delete Record Errors

1. **Record Not Found**: Display "记录不存在" (Record not found)
2. **Delete Failed**: Display "删除失败，请重试" (Delete failed, please retry)

## Testing Strategy

### Unit Tests

1. **Save Record**:
   - Valid record saves correctly
   - Record contains all required fields
   - Success message displays
   - Invalid record rejected

2. **Load Record**:
   - Record data populates fields correctly
   - Result recalculates
   - History panel closes

3. **Delete Record**:
   - Record removed from list
   - Record removed from LocalStorage
   - List updates immediately

4. **Clear All**:
   - All records deleted
   - History empty state displays
   - Confirmation required

5. **History Display**:
   - Records sorted by timestamp (newest first)
   - Timestamps formatted correctly
   - Empty state displays when no records

### Property-Based Tests

1. **Record Persistence Property** (Property 1):
   - Generate random records
   - Save to LocalStorage
   - Retrieve and verify all fields match
   - Minimum 100 iterations

2. **Record Uniqueness Property** (Property 2):
   - Generate multiple records
   - Verify all IDs are unique
   - Minimum 100 iterations

3. **History Ordering Property** (Property 3):
   - Generate records with random timestamps
   - Verify sorted by timestamp descending
   - Minimum 100 iterations

4. **Delete Removes Record Property** (Property 4):
   - Save multiple records
   - Delete one record
   - Verify it's not in retrieved records
   - Minimum 100 iterations

5. **Load Restores Data Property** (Property 5):
   - Save record with random data
   - Load record
   - Verify all fields match original
   - Minimum 100 iterations

6. **Clear All Removes All Property** (Property 6):
   - Save multiple records
   - Clear all
   - Verify history is empty
   - Minimum 100 iterations

7. **Product Name Validation Property** (Property 7):
   - Generate product names of various lengths
   - Verify names ≤ 50 characters
   - Minimum 100 iterations

8. **Empty State Handling Property** (Property 8):
   - With 0 records, verify empty state displays
   - With 1+ records, verify list displays
   - Minimum 100 iterations

## UI/UX Design

### Layout

```
┌─────────────────────────────────────┐
│  重量价格转换器                      │
├─────────────────────────────────────┤
│ 商品名称 [输入框]                   │
│ 重量(克) [输入框]                   │
│ 总价(元) [输入框]                   │
│                                     │
│ [计算] [清除] [保存记录] [查看历史] │
│                                     │
│ 每500g的价格: 100.00 元/斤          │
└─────────────────────────────────────┘

History Panel (Overlay):
┌──────────────────────────┐
│ 价格记录历史              │
├──────────────────────────┤
│ 咖啡                     │
│ 500g - 100元 → 100.00元/斤
│ 2024-01-12 14:30        │
│ [加载] [删除]            │
├──────────────────────────┤
│ 茶叶                     │
│ 250g - 50元 → 100.00元/斤
│ 2024-01-12 13:15        │
│ [加载] [删除]            │
├──────────────────────────┤
│ [清空历史]               │
└──────────────────────────┘
```

### Styling

- **History Button**: Gradient background, positioned next to "View History"
- **History Panel**: Glassmorphic overlay, slides in from right
- **Record Items**: Semi-transparent cards with hover effects
- **Buttons**: Consistent with existing design (gradient, hover states)
- **Timestamps**: Slate-400 text, smaller font size

### Animations

- **Panel Slide**: 0.3s ease-out from right
- **Record Fade**: 0.2s fade-in when added
- **Delete Fade**: 0.2s fade-out when removed
- **Success Message**: 2s fade-in then fade-out

## Performance Considerations

- **LocalStorage Limit**: ~5MB per domain (can store ~1000 records)
- **Rendering**: Virtualize list if 100+ records
- **Search**: Add search/filter if needed in future
- **Export**: Consider CSV export feature later


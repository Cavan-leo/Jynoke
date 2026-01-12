/**
 * History utility functions for managing price records
 * Handles LocalStorage persistence and record operations
 */

import { PriceRecord } from '../types';

const STORAGE_KEY = 'jynoke_price_records';

/**
 * Generate unique ID for a record (timestamp-based)
 */
export const generateRecordId = (): string => {
  return Date.now().toString();
};

/**
 * Format Unix timestamp to readable date/time string
 * Format: "YYYY-MM-DD HH:mm"
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Get all records from LocalStorage
 * Returns empty array if no records or error occurs
 */
export const getRecordsFromStorage = (): PriceRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const records = JSON.parse(stored) as PriceRecord[];
    // Validate records structure
    if (!Array.isArray(records)) {
      return [];
    }
    return records;
  } catch (error) {
    console.error('Failed to load records from storage:', error);
    return [];
  }
};

/**
 * Save records to LocalStorage
 * Throws error if storage is full or unavailable
 */
export const saveRecordsToStorage = (records: PriceRecord[]): void => {
  try {
    const serialized = JSON.stringify(records);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error('STORAGE_FULL');
      }
    }
    throw new Error('STORAGE_UNAVAILABLE');
  }
};

/**
 * Create a new price record
 */
export const createRecord = (
  productName: string,
  weight: number,
  price: number,
  pricePerUnit: number
): PriceRecord => {
  return {
    id: generateRecordId(),
    productName: productName || '未命名商品',
    weight,
    price,
    pricePerUnit,
    timestamp: Date.now(),
  };
};

/**
 * Add a new record to the list and save to storage
 */
export const addRecord = (
  records: PriceRecord[],
  newRecord: PriceRecord
): PriceRecord[] => {
  const updated = [newRecord, ...records]; // Newest first
  saveRecordsToStorage(updated);
  return updated;
};

/**
 * Delete a record by ID and save to storage
 */
export const deleteRecord = (
  records: PriceRecord[],
  recordId: string
): PriceRecord[] => {
  const updated = records.filter((r) => r.id !== recordId);
  saveRecordsToStorage(updated);
  return updated;
};

/**
 * Delete all records after confirmation
 */
export const clearAllRecords = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear records:', error);
    throw new Error('CLEAR_FAILED');
  }
};

/**
 * Get a record by ID
 */
export const getRecordById = (
  records: PriceRecord[],
  recordId: string
): PriceRecord | undefined => {
  return records.find((r) => r.id === recordId);
};

/**
 * Sort records by timestamp (newest first)
 */
export const sortRecordsByTimestamp = (records: PriceRecord[]): PriceRecord[] => {
  return [...records].sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Validate product name length
 */
export const validateProductName = (name: string): boolean => {
  return name.length <= 50;
};

/**
 * Truncate product name to max 50 characters
 */
export const truncateProductName = (name: string): string => {
  return name.substring(0, 50);
};

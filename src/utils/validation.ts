/**
 * Input validation utilities for WeightPriceConverter
 */

import { ValidationResult, PriceCalculationInput, PriceCalculationResult } from '../types';

// Constants for input constraints
const MAX_SAFE_NUMBER = 1e10; // 10 billion
const MIN_SAFE_NUMBER = 1e-6; // 0.000001

/**
 * Validates weight and price inputs
 */
export function validateInputs(weight: string, price: string): ValidationResult {
  // Sanitize inputs first
  const sanitizedWeight = sanitizeInput(weight);
  const sanitizedPrice = sanitizeInput(price);

  // Check for empty inputs
  if (!sanitizedWeight || !sanitizedPrice) {
    return {
      isValid: false,
      error: '请输入重量和价格',
    };
  }

  // Parse inputs
  const weightNum = parseFloat(sanitizedWeight);
  const priceNum = parseFloat(sanitizedPrice);

  // Check for non-numeric values
  if (isNaN(weightNum) || isNaN(priceNum)) {
    return {
      isValid: false,
      error: '请输入有效的数字',
    };
  }

  // Check for negative values
  if (weightNum < 0 || priceNum < 0) {
    return {
      isValid: false,
      error: '重量和价格必须为正数',
    };
  }

  // Check for zero weight
  if (weightNum === 0) {
    return {
      isValid: false,
      error: '重量不能为零',
    };
  }

  // Check for very large numbers
  if (weightNum > MAX_SAFE_NUMBER || priceNum > MAX_SAFE_NUMBER) {
    return {
      isValid: false,
      error: '输入的数字过大，请输入较小的值',
    };
  }

  // Check for very small numbers (near zero)
  if (weightNum < MIN_SAFE_NUMBER && weightNum > 0) {
    return {
      isValid: false,
      error: '重量过小，请输入较大的值',
    };
  }

  return { isValid: true };
}

/**
 * Calculates price per unit weight (per 500g)
 * Formula: (price / weight) * 500
 * 
 * This function implements the core calculation logic:
 * - Takes total price and weight as input
 * - Divides price by weight to get price per gram
 * - Multiplies by 500 to get price per 500g (per 斤)
 * - Formats result to 2 decimal places with currency unit
 */
export function calculatePrice(input: PriceCalculationInput): PriceCalculationResult {
  // Calculate price per unit: (price / weight) * 500
  const pricePerUnit = (input.price / input.weight) * 500;
  
  // Format to 2 decimal places with currency unit
  const formatted = `${pricePerUnit.toFixed(2)} 元/斤`;

  return {
    pricePerUnit,
    formatted,
  };
}

/**
 * Trims whitespace from input strings
 */
export function sanitizeInput(input: string): string {
  return input.trim();
}

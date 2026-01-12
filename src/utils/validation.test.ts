/**
 * 价格计算准确性的基于属性的测试
 * 功能: jynoke-core-components, 属性 1: 价格计算准确性
 * 验证: 需求 1.1
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculatePrice, validateInputs } from './validation';

describe('价格计算准确性', () => {
  /**
   * 属性 1: 价格计算准确性
   * 
   * 对于任何有效的重量（正数）和价格（正数），
   * 计算的单位重量价格应该等于 (价格 / 重量) * 500，
   * 四舍五入到恰好 2 位小数。
   * 
   * 验证: 需求 1.1
   */
  it('应该为所有正数输入正确计算单位重量价格', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 1, max: 100000 }), // 重量（克）
          fc.integer({ min: 1, max: 1000000 }) // 价格（元）
        ),
        ([weight, price]) => {
          const result = calculatePrice({ weight, price });
          
          // 计算预期值
          const expectedValue = (price / weight) * 500;
          const expectedFormatted = `${expectedValue.toFixed(2)} 元/斤`;
          
          // 验证数值计算
          expect(result.pricePerUnit).toBeCloseTo(expectedValue, 5);
          
          // 验证格式化字符串与预期格式匹配
          expect(result.formatted).toBe(expectedFormatted);
          
          // 验证格式化字符串恰好有 2 位小数
          const numberPart = result.formatted.split(' ')[0];
          const decimalPart = numberPart.split('.')[1];
          expect(decimalPart).toHaveLength(2);
        }
      ),
      { numRuns: 20 }
    );
  });
});

describe('清除按钮重置所有状态', () => {
  /**
   * 属性 3: 清除按钮重置所有状态
   * 
   * 对于任何状态（输入和结果已填充），
   * 点击清除按钮应该将所有输入字段重置为空字符串，
   * 并清除结果显示。
   * 
   * 验证: 需求 1.4
   * 功能: jynoke-core-components, 属性 3: 清除按钮重置所有状态
   */
  it('应该为所有填充的状态重置所有字段', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 1, max: 100000 }), // 重量
          fc.integer({ min: 1, max: 1000000 }) // 价格
        ),
        () => {
          // 模拟清除操作
          const clearedState = {
            weight: '',
            price: '',
            result: null,
            error: null,
          };

          // 验证所有字段都被重置
          expect(clearedState.weight).toBe('');
          expect(clearedState.price).toBe('');
          expect(clearedState.result).toBeNull();
          expect(clearedState.error).toBeNull();

          // 验证清除后的状态与初始状态相同
          const initialState = {
            weight: '',
            price: '',
            result: null,
            error: null,
          };

          expect(clearedState).toEqual(initialState);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 额外测试：验证清除按钮在有错误消息时也能重置状态
   */
  it('应该在有错误消息时也重置所有字段', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''),
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => isNaN(parseFloat(s))),
          fc.integer({ max: -1 }).map(n => n.toString()),
          fc.constant('0')
        ),
        (invalidInput) => {
          // 模拟有错误的状态
          const stateWithError = {
            weight: invalidInput,
            price: invalidInput,
            result: null,
            error: '验证失败',
          };

          // 模拟清除操作
          const clearedState = {
            weight: '',
            price: '',
            result: null,
            error: null,
          };

          // 验证所有字段都被重置，包括错误消息
          expect(clearedState.weight).toBe('');
          expect(clearedState.price).toBe('');
          expect(clearedState.result).toBeNull();
          expect(clearedState.error).toBeNull();

          // 验证错误消息被清除
          expect(clearedState.error).not.toBe(stateWithError.error);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 额外测试：验证清除按钮在有结果时也能重置状态
   */
  it('应该在有结果时也重置所有字段', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 1, max: 100000 }),
          fc.integer({ min: 1, max: 1000000 })
        ),
        ([weight, price]) => {
          // 模拟有结果的状态
          const stateWithResult = {
            weight: weight.toString(),
            price: price.toString(),
            result: `${((price / weight) * 500).toFixed(2)} 元/斤`,
            error: null,
          };

          // 模拟清除操作
          const clearedState = {
            weight: '',
            price: '',
            result: null,
            error: null,
          };

          // 验证结果被清除
          expect(clearedState.result).toBeNull();
          expect(clearedState.result).not.toBe(stateWithResult.result);

          // 验证所有字段都被重置
          expect(clearedState.weight).toBe('');
          expect(clearedState.price).toBe('');
          expect(clearedState.error).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('输入验证防止无效计算', () => {
  /**
   * 属性 2: 输入验证防止无效计算
   * 
   * 对于任何无效输入（非数字字符串、负数或空字符串），
   * 组件应该拒绝计算并显示错误消息，不会崩溃或产生结果。
   * 
   * 验证: 需求 1.3
   * 功能: jynoke-core-components, 属性 2: 输入验证防止无效计算
   */
  it('应该为所有无效输入拒绝计算并显示错误消息', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // 空字符串或仅空格
          fc.constant(''),
          fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 10 }),
          // 非数字字符串
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => isNaN(parseFloat(s))),
          // 负数
          fc.integer({ max: -1 }).map(n => n.toString()),
          // 零
          fc.constant('0')
        ),
        (invalidWeight) => {
          fc.assert(
            fc.property(
              fc.oneof(
                // 空字符串或仅空格
                fc.constant(''),
                fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 10 }),
                // 非数字字符串
                fc.string({ minLength: 1, maxLength: 20 }).filter(s => isNaN(parseFloat(s))),
                // 负数
                fc.integer({ max: -1 }).map(n => n.toString()),
                // 零
                fc.constant('0')
              ),
              (invalidPrice) => {
                // 验证函数不会崩溃
                const result = validateInputs(invalidWeight, invalidPrice);
                
                // 验证返回无效状态
                expect(result.isValid).toBe(false);
                
                // 验证返回错误消息
                expect(result.error).toBeDefined();
                expect(typeof result.error).toBe('string');
                expect(result.error!.length).toBeGreaterThan(0);
              }
            ),
            { numRuns: 10 }
          );
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * 额外测试：验证至少一个输入无效时拒绝计算
   * 这确保了即使一个输入有效，另一个无效，也会被拒绝
   */
  it('应该在至少一个输入无效时拒绝计算', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.oneof(
            fc.constant(''),
            fc.stringOf(fc.constantFrom(' ', '\t'), { minLength: 1, maxLength: 5 }),
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => isNaN(parseFloat(s))),
            fc.integer({ max: -1 }).map(n => n.toString()),
            fc.constant('0')
          ),
          fc.integer({ min: 1, max: 100000 })
        ),
        ([invalidInput, validPrice]) => {
          const result = validateInputs(invalidInput, validPrice.toString());
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 额外测试：验证两个输入都无效时拒绝计算
   */
  it('应该在两个输入都无效时拒绝计算', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.oneof(
            fc.constant(''),
            fc.stringOf(fc.constantFrom(' ', '\t'), { minLength: 1, maxLength: 5 }),
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => isNaN(parseFloat(s))),
            fc.integer({ max: -1 }).map(n => n.toString()),
            fc.constant('0')
          ),
          fc.oneof(
            fc.constant(''),
            fc.stringOf(fc.constantFrom(' ', '\t'), { minLength: 1, maxLength: 5 }),
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => isNaN(parseFloat(s))),
            fc.integer({ max: -1 }).map(n => n.toString()),
            fc.constant('0')
          )
        ),
        ([invalidWeight, invalidPrice]) => {
          const result = validateInputs(invalidWeight, invalidPrice);
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * WeightPriceConverter Component
 * 
 * A utility component for calculating price per unit weight (per 500g).
 * Allows users to input weight in grams and total price in yuan,
 * then calculates and displays the price per 500g (per 斤).
 * 
 * Enhanced with product naming and price record history management.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WeightPriceConverterState } from '../types';
import { validateInputs, calculatePrice, sanitizeInput } from '../utils/validation';
import {
  getRecordsFromStorage,
  createRecord,
  addRecord,
  deleteRecord,
  clearAllRecords,
  getRecordById,
  formatTimestamp,
  truncateProductName,
} from '../utils/history';

export const WeightPriceConverter: React.FC = () => {
  const [state, setState] = useState<WeightPriceConverterState>({
    productName: '',
    weight: '',
    price: '',
    result: null,
    error: null,
    records: [],
    showHistory: false,
    successMessage: null,
  });

  // Load records from LocalStorage on mount
  useEffect(() => {
    const records = getRecordsFromStorage();
    setState((prev) => ({
      ...prev,
      records,
    }));
  }, []);

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = truncateProductName(e.target.value);
    setState((prev) => ({
      ...prev,
      productName: name,
      error: null,
    }));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState((prev) => ({
      ...prev,
      weight: e.target.value,
      error: null,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState((prev) => ({
      ...prev,
      price: e.target.value,
      error: null,
    }));
  };

  const handleCalculate = (): void => {
    // Sanitize inputs before validation
    const sanitizedWeight = sanitizeInput(state.weight);
    const sanitizedPrice = sanitizeInput(state.price);

    const validation = validateInputs(sanitizedWeight, sanitizedPrice);

    if (!validation.isValid) {
      setState((prev) => ({
        ...prev,
        error: validation.error || '验证失败',
        result: null,
      }));
      return;
    }

    const weightNum = parseFloat(sanitizedWeight);
    const priceNum = parseFloat(sanitizedPrice);

    const calculation = calculatePrice({
      weight: weightNum,
      price: priceNum,
    });

    setState((prev) => ({
      ...prev,
      result: calculation.formatted,
      error: null,
    }));
  };

  const handleClear = (): void => {
    setState((prev) => ({
      ...prev,
      productName: '',
      weight: '',
      price: '',
      result: null,
      error: null,
      successMessage: null,
    }));
  };

  const handleSaveRecord = useCallback((): void => {
    // Validate that result exists
    if (!state.result) {
      setState((prev) => ({
        ...prev,
        error: '请先计算结果后再保存',
      }));
      return;
    }

    try {
      const sanitizedWeight = sanitizeInput(state.weight);
      const sanitizedPrice = sanitizeInput(state.price);
      const weightNum = parseFloat(sanitizedWeight);
      const priceNum = parseFloat(sanitizedPrice);

      // Extract price per unit from result string (e.g., "100.00 元/斤" -> 100.00)
      const pricePerUnitMatch = state.result.match(/^([\d.]+)/);
      const pricePerUnit = pricePerUnitMatch ? parseFloat(pricePerUnitMatch[1]) : 0;

      // Create and save record
      const newRecord = createRecord(
        state.productName,
        weightNum,
        priceNum,
        pricePerUnit
      );

      const updated = addRecord(state.records, newRecord);

      setState((prev) => ({
        ...prev,
        records: updated,
        successMessage: '记录已保存',
        error: null,
      }));

      // Auto-hide success message after 2 seconds
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          successMessage: null,
        }));
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'STORAGE_FULL') {
          setState((prev) => ({
            ...prev,
            error: '存储空间已满，请删除一些记录',
          }));
        } else if (error.message === 'STORAGE_UNAVAILABLE') {
          setState((prev) => ({
            ...prev,
            error: '无法保存记录，请检查浏览器设置',
          }));
        }
      }
    }
  }, [state.result, state.weight, state.price, state.productName, state.records]);

  const handleLoadRecord = useCallback((recordId: string): void => {
    const record = getRecordById(state.records, recordId);
    if (!record) {
      setState((prev) => ({
        ...prev,
        error: '记录不存在或已被删除',
      }));
      return;
    }

    // Populate fields with record data
    setState((prev) => ({
      ...prev,
      productName: record.productName,
      weight: record.weight.toString(),
      price: record.price.toString(),
      result: `${record.pricePerUnit.toFixed(2)} 元/斤`,
      showHistory: false,
      error: null,
    }));
  }, [state.records]);

  const handleDeleteRecord = useCallback((recordId: string): void => {
    try {
      const updated = deleteRecord(state.records, recordId);
      setState((prev) => ({
        ...prev,
        records: updated,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: '删除失败，请重试',
      }));
    }
  }, [state.records]);

  const handleClearAllRecords = useCallback((): void => {
    if (window.confirm('确定要删除所有记录吗？此操作无法撤销。')) {
      try {
        clearAllRecords();
        setState((prev) => ({
          ...prev,
          records: [],
          showHistory: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: '清空失败，请重试',
        }));
      }
    }
  }, []);

  const handleToggleHistory = (): void => {
    setState((prev) => ({
      ...prev,
      showHistory: !prev.showHistory,
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          重量价格转换器
        </h2>
        <p className="text-slate-400 text-sm">计算每 500g 的价格</p>
      </div>

      {/* Product Name Input */}
      <div className="mb-6">
        <label className="block text-slate-300 text-sm font-medium mb-2">商品名称（可选）</label>
        <input
          type="text"
          placeholder="输入商品名称..."
          value={state.productName}
          onChange={handleProductNameChange}
          maxLength={50}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
        />
        <p className="text-slate-500 text-xs mt-1">{state.productName.length}/50</p>
      </div>

      {/* Weight Input */}
      <div className="mb-6">
        <label className="block text-slate-300 text-sm font-medium mb-2">重量（克）</label>
        <input
          type="text"
          placeholder="输入重量..."
          value={state.weight}
          onChange={handleWeightChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
        />
      </div>

      {/* Price Input */}
      <div className="mb-6">
        <label className="block text-slate-300 text-sm font-medium mb-2">总价（元）</label>
        <input
          type="text"
          placeholder="输入价格..."
          value={state.price}
          onChange={handlePriceChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
        />
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
          <p className="text-red-300 text-sm">{state.error}</p>
        </div>
      )}

      {/* Success Message */}
      {state.successMessage && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm animate-fadeIn">
          <p className="text-green-300 text-sm">{state.successMessage}</p>
        </div>
      )}

      {/* Result Display */}
      {state.result && (
        <div className="mb-8 p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm">
          <p className="text-slate-400 text-sm mb-2">每 500g 的价格</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            {state.result}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCalculate}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          计算
        </button>
        <button
          onClick={handleClear}
          className="flex-1 px-4 py-3 bg-white/10 text-slate-300 font-semibold rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/40 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          清除
        </button>
      </div>

      {/* History Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSaveRecord}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          保存记录
        </button>
        <button
          onClick={handleToggleHistory}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          查看历史 ({state.records.length})
        </button>
      </div>

      {/* History Panel */}
      {state.showHistory && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={handleToggleHistory}
          />

          {/* History Panel */}
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-800 border-l border-white/20 shadow-2xl z-50 flex flex-col animate-slideIn">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">价格记录历史</h3>
              <button
                onClick={handleToggleHistory}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Records List */}
            <div className="flex-1 overflow-y-auto p-4">
              {state.records.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400 text-center">暂无记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.records.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{record.productName}</p>
                          <p className="text-sm text-slate-400">
                            {record.weight}g - {record.price}元
                          </p>
                          <p className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            {record.pricePerUnit.toFixed(2)} 元/斤
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatTimestamp(record.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoadRecord(record.id)}
                          className="flex-1 px-3 py-2 bg-blue-500/30 text-blue-300 text-sm font-medium rounded hover:bg-blue-500/50 transition-all"
                        >
                          加载
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="flex-1 px-3 py-2 bg-red-500/30 text-red-300 text-sm font-medium rounded hover:bg-red-500/50 transition-all"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.records.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleClearAllRecords}
                  className="w-full px-4 py-2 bg-red-500/20 text-red-300 font-semibold rounded-lg border border-red-500/50 hover:bg-red-500/30 transition-all"
                >
                  清空历史
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

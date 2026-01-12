/**
 * Main Application Container
 * 
 * Modern dark-mode UI with glassmorphism design
 * Navigation-based layout for switching between different tools
 */

import React, { useState } from 'react';
import { WeightPriceConverter } from './components/WeightPriceConverter';
import { DiceRoller } from './components/DiceRoller';
import { ErrorBoundary } from './components/ErrorBoundary';

type ToolType = 'converter' | 'dice';

export const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('converter');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Navigation Header */}
        <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/50 border-b border-white/10">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Jynoke
                </h1>
                <p className="text-slate-400 text-sm mt-1">个人工具集合</p>
              </div>
            </div>

            {/* Tool Navigation Tabs */}
            <div className="flex gap-3 flex-wrap">
              {[
                { id: 'converter', label: '重量价格转换器', icon: '💰' },
                { id: 'dice', label: '骰子滚轮', icon: '🎲' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as ToolType)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTool === tool.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20 hover:border-white/40'
                  }`}
                >
                  <span className="mr-2">{tool.icon}</span>
                  {tool.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* WeightPriceConverter Tool */}
          {activeTool === 'converter' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-fadeIn hover:border-white/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
              <div className="relative">
                <ErrorBoundary>
                  <WeightPriceConverter />
                </ErrorBoundary>
              </div>
            </div>
          )}

          {/* DiceRoller Tool */}
          {activeTool === 'dice' && (
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-fadeIn hover:border-white/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none"></div>
              <div className="relative">
                <ErrorBoundary>
                  <DiceRoller />
                </ErrorBoundary>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-12 text-slate-500 text-sm border-t border-white/10 mt-12">
          <p>© 2024 Jynoke. Crafted with precision.</p>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
};

export default App;

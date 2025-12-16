import React, { useState, useEffect } from 'react';
import { SajuForm } from './components/SajuForm';
import { ResultDisplay } from './components/ResultDisplay';
import { UserInput, SajuResult, Topic } from './types';
import { analyzeSaju } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [result, setResult] = useState<SajuResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  // Rotate loading messages
  useEffect(() => {
    // Fixed: Use 'any' to avoid "Cannot find namespace 'NodeJS'" in environments where @types/node is not available.
    let interval: any;
    if (loading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[i]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFormSubmit = async (data: UserInput) => {
    setUserInput(data);
    setLoading(true);
    setError(null);
    setResult(null); // Clear previous result

    try {
      // Simulate a minimum wait time for "mystical" feel (optional, but good UX for heavy processes)
      const minTime = new Promise(resolve => setTimeout(resolve, 2000));
      const apiCall = analyzeSaju(data);
      
      const [_, apiResult] = await Promise.all([minTime, apiCall]);
      
      setResult(apiResult);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    // Don't clear userInput here so we can preserve data for re-entry
    // setUserInput(null); 
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-amber-900 selection:text-white pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-full h-64 bg-slate-800/20 rounded-t-[50%] blur-3xl"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        
        {/* Header */}
        {!result && (
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 mb-4">
              천기누설 (天機漏洩)
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light tracking-wide">
              AI가 읽어내는 당신의 운명, 정통 명리학 분석
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 animate-pulse">
            <div className="w-24 h-24 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_15px_rgba(217,119,6,0.5)]"></div>
            <h2 className="text-2xl font-serif text-amber-500 mb-2">{loadingMsg}</h2>
            <p className="text-slate-500 text-sm">잠시만 기다려주세요...</p>
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto bg-red-900/20 border border-red-800 p-8 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-red-500 mb-2">오류 발생</h3>
            <p className="text-slate-300 mb-6">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        ) : result && userInput ? (
          <ResultDisplay 
            result={result} 
            topic={userInput.topic} 
            onReset={handleReset} 
          />
        ) : (
          <SajuForm 
            onSubmit={handleFormSubmit} 
            isLoading={loading} 
            initialData={userInput} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-slate-600 text-sm py-8">
        <p>&copy; {new Date().getFullYear()} Cheon-Gi Saju Analysis. All rights reserved.</p>
        <p className="text-xs mt-1 opacity-50">본 서비스는 AI 기반 엔터테인먼트 목적의 운세 서비스입니다.</p>
      </footer>
    </div>
  );
};

export default App;
import React from 'react';
import { SajuResult, Topic } from '../types';
import { Button } from './Button';
import { LuckChart } from './LuckChart';

interface ResultDisplayProps {
  result: SajuResult;
  topic: Topic;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, topic, onReset }) => {
  const isLove = topic === Topic.LOVE;
  const themeColor = isLove ? '#ec4899' : '#d97706'; // Pink for Love, Amber for Wealth
  
  // A simple markdown-to-jsx parser for the specific format requested
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl md:text-2xl font-serif font-bold text-amber-500 mt-8 mb-4 border-b border-slate-700 pb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl md:text-3xl font-serif font-bold text-slate-100 mt-10 mb-6 text-center bg-slate-800/50 py-4 rounded-lg">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('---')) {
        return <hr key={index} className="border-slate-700 my-8" />;
      }
      
      // List items
      if (line.trim().startsWith('* ')) {
        // Parse bolding inside list items
        const content = line.trim().replace('* ', '');
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return (
          <li key={index} className="ml-4 mb-2 list-disc text-slate-300 pl-2 marker:text-amber-600">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className={`font-bold ${isLove ? 'text-pink-400' : 'text-amber-400'}`}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </li>
        );
      }

      // Paragraphs with bolding
      if (line.trim() !== '') {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="mb-4 text-slate-300 leading-relaxed text-lg">
             {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className={`font-bold ${isLove ? 'text-pink-400' : 'text-amber-400'}`}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
      
      return null;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Image Area */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b ${isLove ? 'from-pink-900/80' : 'from-amber-900/80'} to-slate-900 z-10`}></div>
          <img 
            src={isLove ? "https://picsum.photos/1200/400?grayscale&blur=2" : "https://picsum.photos/1200/401?grayscale&blur=2"} 
            alt="Mystical Background" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
            <span className="text-amber-400 font-serif tracking-widest text-sm uppercase mb-2">Cheon-Gi Saju Analysis</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white text-shadow-lg text-center">
              {topic} 정밀 분석
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-12">
          
          {/* Chart Section - Only if data exists */}
          {result.monthlyLuck.length > 0 && (
            <div className="mb-12">
              <LuckChart data={result.monthlyLuck} color={themeColor} />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            {renderContent(result.markdownText)}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col items-center gap-4">
             <p className="text-slate-500 text-sm text-center italic">
              운명은 정해진 것이 아니라, 당신의 의지로 만들어가는 것입니다. <br/>
              이 분석이 당신의 길에 작은 등불이 되기를 바랍니다.
            </p>
            <Button onClick={onReset} variant="outline" className="w-auto px-8">
              다른 운세 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

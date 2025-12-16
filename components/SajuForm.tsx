import React, { useState } from 'react';
import { UserInput, Gender, Topic, DetailLevel } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

interface SajuFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  initialData?: UserInput | null;
}

const generateNumberOptions = (start: number, end: number, suffix: string = '') => {
  const options = [];
  for (let i = start; i <= end; i++) {
    options.push({ label: `${i}${suffix}`, value: i });
  }
  return options;
};

export const SajuForm: React.FC<SajuFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState<UserInput>(() => {
    if (initialData) {
      return initialData;
    }
    return {
      name: '',
      gender: Gender.MALE,
      birthYear: 1990,
      birthMonth: 1,
      birthDay: 1,
      birthTime: '',
      targetYear: currentYear + 1,
      topic: Topic.WEALTH,
      detailLevel: DetailLevel.GENERAL
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof UserInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-serif text-amber-500 mb-6 text-center">사주 정보 입력</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="이름 (Name)" 
            value={formData.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            placeholder="홍길동"
            required
          />
          
          <Select 
            label="성별 (Gender)"
            options={[
              { label: '남성 (Male)', value: Gender.MALE },
              { label: '여성 (Female)', value: Gender.FEMALE }
            ]}
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value as Gender)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Select 
            label="생년 (Year)"
            options={generateNumberOptions(1940, currentYear, '년').reverse()}
            value={formData.birthYear}
            onChange={(e) => handleChange('birthYear', Number(e.target.value))}
          />
          <Select 
            label="생월 (Month)"
            options={generateNumberOptions(1, 12, '월')}
            value={formData.birthMonth}
            onChange={(e) => handleChange('birthMonth', Number(e.target.value))}
          />
          <Select 
            label="생일 (Day)"
            options={generateNumberOptions(1, 31, '일')}
            value={formData.birthDay}
            onChange={(e) => handleChange('birthDay', Number(e.target.value))}
          />
        </div>

        <div className="mt-6">
          <Input 
            label="태어난 시간 (선택사항, 24시간제)" 
            type="time"
            value={formData.birthTime} 
            onChange={(e) => handleChange('birthTime', e.target.value)} 
          />
          <p className="text-xs text-slate-500 mt-2 text-right">* 시간을 입력하면 더 정확한 분석이 가능합니다.</p>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-serif text-amber-500 mb-6 text-center">분석 설정</h2>

        <div className="space-y-6">
           <Select 
            label="분석 목표 연도 (Target Year)"
            options={generateNumberOptions(currentYear, currentYear + 5, '년')}
            value={formData.targetYear}
            onChange={(e) => handleChange('targetYear', Number(e.target.value))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.topic === Topic.WEALTH ? 'border-amber-500 bg-amber-900/20' : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'}`}
              onClick={() => handleChange('topic', Topic.WEALTH)}
            >
              <div className="font-serif text-lg font-bold text-amber-400 mb-1">금전운 (Wealth)</div>
              <div className="text-sm text-slate-400">재물 흐름, 투자, 사업운 분석</div>
            </div>
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.topic === Topic.LOVE ? 'border-pink-500 bg-pink-900/20' : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'}`}
              onClick={() => handleChange('topic', Topic.LOVE)}
            >
              <div className="font-serif text-lg font-bold text-pink-400 mb-1">연애운 (Love)</div>
              <div className="text-sm text-slate-400">인연, 결혼, 관계 흐름 분석</div>
            </div>
          </div>

          <Select 
            label="분석 깊이 (Level of Detail)"
            options={[
              { label: '일반 버전 - 핵심 요약 (2000자)', value: DetailLevel.GENERAL },
              { label: '심층 버전 - 월별 상세 흐름 (3000자)', value: DetailLevel.DEEP }
            ]}
            value={formData.detailLevel}
            onChange={(e) => handleChange('detailLevel', e.target.value as DetailLevel)}
          />
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="text-lg py-4">
        천기누설 (운세 확인하기)
      </Button>
    </form>
  );
};
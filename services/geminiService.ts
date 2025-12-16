import { GoogleGenAI } from "@google/genai";
import { UserInput, SajuResult, MonthlyLuck } from '../types';
import { SAJU_SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeSaju = async (input: UserInput): Promise<SajuResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const prompt = `
    사용자 정보:
    이름: ${input.name}
    성별: ${input.gender}
    생년월일: ${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일
    태어난 시간: ${input.birthTime || "모름 (시간 모름으로 간주하고 삼주로 분석)"}
    
    분석 요청 사항:
    목표 연도: ${input.targetYear}년
    분석 주제: ${input.topic}
    분석 모드: ${input.detailLevel}
    
    위 정보를 바탕으로 사주를 분석해주세요.
    마지막에 JSON 데이터를 반드시 포함해야 합니다.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SAJU_SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but grounded
      },
    });

    const fullText = response.text || "";
    
    // Extract JSON from the end
    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    let monthlyLuck: MonthlyLuck[] = [];
    let markdownText = fullText;

    if (jsonMatch && jsonMatch[1]) {
      try {
        monthlyLuck = JSON.parse(jsonMatch[1]);
        // Remove the JSON block from the text to display cleanly
        markdownText = fullText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        console.error("Failed to parse monthly luck JSON", e);
        // Fallback or empty array
      }
    }

    return {
      markdownText,
      monthlyLuck
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("운세를 분석하는 도중 천기의 흐름이 끊겼습니다. 잠시 후 다시 시도해주세요.");
  }
};

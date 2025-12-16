export enum Gender {
  MALE = '남성',
  FEMALE = '여성'
}

export enum Topic {
  WEALTH = '금전운',
  LOVE = '연애운'
}

export enum DetailLevel {
  GENERAL = '일반 버전 (2000자)',
  DEEP = '심층 버전 (3000자)'
}

export interface UserInput {
  name: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthTime: string; // HH:mm
  targetYear: number;
  topic: Topic;
  detailLevel: DetailLevel;
}

export interface MonthlyLuck {
  month: number;
  score: number; // 0-100
  keyword: string;
}

export interface SajuResult {
  markdownText: string;
  monthlyLuck: MonthlyLuck[];
}

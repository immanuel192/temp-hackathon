import { IComprehendScore } from '@/share';

export interface IAWSComprehend {
  analyse(text: string[]): Promise<IComprehendScore>;
}

export * from './slack/interfaces';
export * from './firestore/interface';

export interface IExecutionResult {
  nextTs: number; total: number; error: string;
}

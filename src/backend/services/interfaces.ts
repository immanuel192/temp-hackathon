import { IComprehendScore } from '@/share';

export interface IAWSComprehend {
  analyse(text: string[]): Promise<IComprehendScore>;
}

export * from './slack/interfaces';
export * from './firestore/interface';

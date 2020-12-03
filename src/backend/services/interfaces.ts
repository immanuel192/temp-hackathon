import { IComprehendScore } from '@/share';

export interface IAWSComprehend {
  analyse(text: string[]): Promise<IComprehendScore>;
}

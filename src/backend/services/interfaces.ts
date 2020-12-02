export interface IComprehendScore {
  mixed: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface IAWSComprehend {
  analyse(text: string[]): Promise<IComprehendScore>;
}

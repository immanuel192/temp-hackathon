import { IAWSComprehend, IComprehendScore } from "@/backend/services/interfaces";

export default class AWSComprehend implements IAWSComprehend {
  public analyse(text: string[]): Promise<IComprehendScore> {
    return Promise.resolve({
      mixed: 0.1,
      positive: 0,
      neutral: 0,
      negative: 0,
    });
  }
}

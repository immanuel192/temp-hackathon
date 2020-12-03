import { IComprehendScore } from "@/share";
import { Comprehend } from 'aws-sdk';
import { IAWSComprehend } from "./interfaces";

export default class AWSComprehend implements IAWSComprehend {
  private comprehend: Comprehend

  constructor() {
    this.comprehend = new Comprehend();
  }

  public analyse(textList: string[]): Promise<IComprehendScore> {
    const singleText = textList.join(' ');
    return new Promise((resolve, reject) => {
      this.comprehend.detectSentiment({ Text: singleText, LanguageCode: 'en' }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const sentimentScore = data.SentimentScore;
          resolve({
            sentiment: data.Sentiment,
            mixed: sentimentScore.Mixed,
            positive: sentimentScore.Positive,
            neutral: sentimentScore.Neutral,
            negative: sentimentScore.Negative,
          });
        }
      });
    });
  }
}

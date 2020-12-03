import { IAWSComprehend } from "./interfaces";
import {IComprehendScore} from "@/share";
import { config, Comprehend } from 'aws-sdk'

config.update({ region: 'eu-west-1' }); // Whatever region for now.

export default class AWSComprehend implements IAWSComprehend {
  private comprehend: Comprehend

  constructor() {
    this.comprehend = new Comprehend()
  }

  // @ts-ignore
  public analyse(textList: string[]): Promise<IComprehendScore> {
    const singleText = textList.join(' ')
    return new Promise((resolve, reject) => {
      this.comprehend.detectSentiment({ Text: singleText, LanguageCode: 'en' }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          const sentimentScore = data.SentimentScore
          resolve({
            sentiment: data.Sentiment,
            mixed: sentimentScore.Mixed,
            positive: sentimentScore.Positive,
            neutral: sentimentScore.Neutral,
            negative: sentimentScore.Negative,
          })
        }
      })
    })
  }
}

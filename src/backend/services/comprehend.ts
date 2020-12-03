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
  public analyse(text: string[]): Promise<IComprehendScore> {
    this.comprehend.batchDetectSentiment({ TextList: text, LanguageCode: 'en' }, (err, data) => {
      if (err) {
        console.error('hmm something went wrong', err)
      } else {
        console.log(data.ResultList)
      }
    })
  }
}

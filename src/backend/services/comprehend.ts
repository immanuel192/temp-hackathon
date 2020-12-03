import { IAWSComprehend } from "./interfaces";
import {IComprehendScore} from "@/share";
import { config, Comprehend } from 'aws-sdk'

config.update({ region: 'eu-west-1' }); // Whatever region for now.

export default class AWSComprehend implements IAWSComprehend {
  private comprehend: Comprehend

  constructor(props) {
    // @ts-ignore
    super(props);
    this.comprehend = new Comprehend()
  }


  public analyse(text: string[]): Promise<IComprehendScore> {
    return Promise.resolve({
      mixed: 0.1,
      positive: 0,
      neutral: 0,
      negative: 0,
    });
  }
}

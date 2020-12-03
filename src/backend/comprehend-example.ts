// TODO: Remove later
import { config } from 'aws-sdk'
import AWSComprehend from "./services/comprehend";

config.update({ region: 'eu-west-1' }); // Whatever region for now.

const awsComprehend = new AWSComprehend();

(async () => {
  const result = await awsComprehend.analyse(['Nice work guys! damn, I screwed up', 'damnn', 'not good']);
  console.log('checking result', result)
})()

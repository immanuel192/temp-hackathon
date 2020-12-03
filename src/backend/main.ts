import AWSComprehend from "./services/comprehend";

const awsComprehend = new AWSComprehend();

(async () => {
  const result = await awsComprehend.analyse(['Nice work guys! damn, I screwed up', 'damnn', 'not good']);
  console.log('checking result', result)
})().then();

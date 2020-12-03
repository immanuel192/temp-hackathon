import AWSComprehend from "./services/comprehend";

const awsComprehend = new AWSComprehend();

(async () => {
  console.log(await awsComprehend.analyse(['test']));
})().then();

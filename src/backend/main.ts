import AWSComprehend from "./services/comprehend";

const awsComprehend = new AWSComprehend();

(async () => {
  await awsComprehend.analyse(['Nice work guys!']);
})().then();

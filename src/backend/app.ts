import './services/config';
import { config } from 'aws-sdk';
import { ISlack, IFireStore, IAWSComprehend } from './services/interfaces';
import { FireStore } from './services/firestore';
import { Slack } from './services/slack';
import { ExecutorOrchestrator } from './services/executor.orchestrator';
import AWSComprehend from './services/comprehend';
import { getCliArgs } from './services/cli';

config.update({ region: 'us-west-2' });

function initDeps() {
  const slack: ISlack = new Slack();
  slack.init();

  console.log('Init Firestore');
  const firestore: IFireStore = new FireStore();
  firestore.init();

  //
  console.log('Init AWS comprehend');
  const awsComprehend: IAWSComprehend = new AWSComprehend();
  return {
    slack, firestore, awsComprehend,
  };
}

console.log('Starting app');
Promise.resolve()
  .then(async () => {
    console.log('Init Slack');
    //
    const args = getCliArgs();

    const deps = initDeps();

    const executors = new ExecutorOrchestrator(deps.slack, deps.firestore, deps.awsComprehend);

    await executors.run({
      direction: args.direction,
      interact: args.keep === true,
      channelId: args.channel,
    });
  })
  .catch((err) => {
    console.error(err);
  });

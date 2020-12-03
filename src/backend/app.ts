import './services/config';
import { config } from 'aws-sdk';
import { ISlack, IFireStore, IAWSComprehend } from './services/interfaces';
import { FireStore } from './services/firestore';
import { Slack } from './services/slack';
import { ChannelCrawlExecutor } from './services/executor';
import AWSComprehend from './services/comprehend';
import { getCliArgs } from './services/cli';

config.update({ region: 'us-west-2' });

console.log('Starting app');
Promise.resolve()
  .then(async () => {
    console.log('Init Slack');
    const slack: ISlack = new Slack();
    slack.init();

    console.log('Init Firestore');
    const firestore: IFireStore = new FireStore();
    firestore.init();

    //
    console.log('Init AWS comprehend');
    const awsComprehend: IAWSComprehend = new AWSComprehend();

    //
    const args = getCliArgs();
    if (args.help) {
      args.tsFlag.Usage();
      return;
    }

    const executor = new ChannelCrawlExecutor(slack, firestore, awsComprehend);

    await executor.run(args.direction, args.keep === true, args.channel);
  })
  .catch((err) => {
    console.error(err);
  });

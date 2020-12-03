import './services/config';
import { config } from 'aws-sdk';
import { TSFlag } from 'ts-flag';
import { ISlack, IFireStore, IAWSComprehend } from './services/interfaces';
import { FireStore } from './services/firestore';
import { Slack } from './services/slack';
import { ChannelCrawlExecutor } from './services/executor';
import AWSComprehend from './services/comprehend';

config.update({ region: 'us-west-2' });

console.log('Starting app');
const flag = new TSFlag();
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
    const channelId = flag.str('channel', null, 'channel Id');

    const executor = new ChannelCrawlExecutor(slack, firestore, awsComprehend);
    await executor.run(channelId);
  })
  .catch((err) => {
    console.error(err);
    flag.Usage();
  });

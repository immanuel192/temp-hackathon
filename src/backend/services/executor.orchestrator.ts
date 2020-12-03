import chalk from 'chalk';
import { ChannelCrawlExecutor } from './executor';
import { IAWSComprehend, IFireStore, ISlack } from './interfaces';

export class ExecutorOrchestrator {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private slack: ISlack,
    private firestore: IFireStore,
    private comprehend: IAWSComprehend,
  ) { }

  async run(options: { direction: 'onward' | 'backward'; interact: boolean; channelId?: string }) {
    if (options.interact) {
      console.log(chalk.red('Running in interacting mode'));
    }

    const channels: string[] = [];

    if (options.channelId) {
      channels.push(options.channelId);
    } else {
      const fetchChannels = await this.firestore.getChannels();
      fetchChannels.forEach((t) => channels.push(t.channelId));
    }

    return '';
  }
}

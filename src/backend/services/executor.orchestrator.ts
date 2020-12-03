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

    const executors = channels.map((channel) => {
      const t = 1;
      // @todo
      const ret = {
        channelId: channel,
        executor: new ChannelCrawlExecutor(this.slack, this.firestore, this.comprehend),
      };

      return ret;
    });

    do {
      await Promise.all(executors.map(async (executor) => {
        await executor.executor.run(options.channelId, options.direction);
      }));

      if (!options.interact) {
        break;
      }
    } while (1);

    console.log('Finish all executors');

    return '';
  }
}

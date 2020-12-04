import chalk from 'chalk';
import bluebird from 'bluebird';
import cliProgress from 'cli-progress';
import { ChannelCrawlExecutor } from './executor';
import {
  IAWSComprehend, IExecutionResult, IFireStore, ISlack,
} from './interfaces';

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

    const channels: { id: string; name: string }[] = [];

    if (options.channelId) {
      const channel = await this.firestore.getChannelById(options.channelId);
      channels.push({ id: options.channelId, name: channel.name });
    } else {
      const fetchChannels = await this.firestore.getChannels();
      fetchChannels.forEach((t) => channels.push({ id: t.channelId, name: t.name }));
    }

    const multibar = new cliProgress.MultiBar({
      clearOnComplete: false,
      hideCursor: true,
      format: 'Channel: {channel} | Current: {current} | Last fetch total: {lastTotal}',

    }, cliProgress.Presets.shades_grey);

    const executors = channels.map((channel) => ({
      channelId: channel.id,
      executor: new ChannelCrawlExecutor(this.slack, this.firestore, this.comprehend),
      progress: multibar.create(200, 0, { channel: channel.name, lastTotal: 0, current: '' }),
    }));

    do {
      await Promise.all(executors.map(async (executor) => {
        const output = (await executor.executor.run(executor.channelId, options.direction)
          .catch((err) => {
            console.error(err);
          })) as IExecutionResult;
        if (output?.nextTs) {
          executor.progress.update({
            current: new Date(output.nextTs).toISOString(),
            lastTotal: output.total,
          });
        }
        if (output?.error) {
          executor.progress.update({
            current: output.error,
            lastTotal: 0,
          });
          executor.progress.stop();
        }
      }));

      if (!options.interact) {
        break;
      } else {
        await bluebird.delay(1000); // to prevent rate limiting
      }
    } while (1);
    multibar.stop();

    // console.log('Finish all executors');

    return '';
  }
}

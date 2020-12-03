import bluebird from 'bluebird';
import { IAWSComprehend, IFireStore, ISlack } from './interfaces';

export class ChannelCrawlExecutor {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private slack: ISlack,
    private firestore: IFireStore,
    private comprehend: IAWSComprehend,
  ) { }

  async run(channelId: string, direction: 'onward' | 'backward') {
    const channel = await this.firestore.getChannelById(channelId);

    if (!channel) {
      throw new Error(`Channel ${channelId} is not found`);
    }

    const lastTs = this.calculateLastTs(channel.lastRead);
    console.log(`Executing channel ${channelId} from ${new Date(lastTs).toISOString()} with direction ${direction}`);

    const response = await this.slack.fetchMessages({
      id: channelId,
      fetchOnward: direction === 'onward',
      ts: lastTs,
    });

    console.log(`Receiving ${response.messages.length} messages`);

    await bluebird.map(response.messages, async (message) => {
      if (!message.text.trim()) {
        return Promise.resolve();
      }

      const score = await this.comprehend.analyse([message.text]);

      console.log(`Adding scpre for ${message.text} as ${score.sentiment}`);
      return this.firestore.addMessageScore(score, channelId, new Date(message.ts));
    }, {
      concurrency: 5,
    });

    console.log(`Update next timestamp to ${new Date(response.nextTs).toISOString()} `);
    await this.firestore.updateChannelLastRead(channelId, response.nextTs);
  }

  /**
   * Calculate the last ts to be used when fetching messages from slack
   * @param lastRead from channel record
   */
  private calculateLastTs(lastRead: number) {
    if (!lastRead) {
      return new Date().setDate(new Date().getDate() - 30);
    }
    return lastRead;
  }
}

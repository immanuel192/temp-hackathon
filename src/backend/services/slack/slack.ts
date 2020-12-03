import { IChannelRecord } from '@/share';
import { App } from '@slack/bolt';
import { IChannelListResponse, ISlack } from './interfaces';

export class Slack implements ISlack {
  private app!: App;

  private slackBotToken: string

  private slackSigningSecret: string

  constructor() {
    this.slackBotToken = process.env.SLACK_BOT_TOKEN || '';
    this.slackSigningSecret = process.env.SLACK_SIGNING_SECRET || '';
  }

  init() {
    this.app = new App({
      token: this.slackBotToken,
      signingSecret: this.slackSigningSecret,
    });
  }

  async getAllChannels() {
    const channels: IChannelRecord[] = [];
    const knownChannelName = ['eng-all', 'announcements-syd', 'announcements-global', 'hackathon-2020', 'sentiminder-hackathon-2020'];
    try {
      let cursor;
      do {
        const result = (await this.app.client.conversations.list({
          // The token you used to initialize your app
          token: this.slackBotToken,
          types: "public_channel,private_channel",
          limit: 1000,
          cursor,
        })) as IChannelListResponse;

        console.log(`Receiving ${result.channels.length} channels`);

        if (result.channels.length > 0) {
          for (const channel of result.channels) {
            if (knownChannelName.includes(channel.name)) {
              channels.push({
                channelId: channel.id,
                name: channel.name,
                isChannel: channel.is_channel,
                isPrivate: channel.is_private,
                lastRead: (channel.last_read || '') ? parseFloat(channel.last_read) * 1000 : 0,
              });
            }
          }

          if (result.response_metadata?.next_cursor) {
            cursor = result.response_metadata.next_cursor;
          } else {
            break;
          }
        } else {
          break;
        }
      } while (0 < 1);
    } catch (error) {
      console.error(error);
    }
    return channels;
  }

  async fetchMessages(id, ts) {
    try {
      // Call the conversations.history method using the built-in WebClient
      const result = await this.app.client.conversations.history({
        // The token you used to initialize your app
        token: process.env.SLACK_BOT_TOKEN,
        channel: id,
        // Limit results
        inclusive: true,
        limit: 10,
      });
      return result.messages;
    } catch (err) {
      console.log(err);
    }
    return '';
  }
}

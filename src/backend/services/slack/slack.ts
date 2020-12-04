import { IChannelRecord } from '@/share';
import { App } from '@slack/bolt';
import {
  IChannelListResponse, IFetchMessagesRequest, ISlack, IFetchMessagesResponse,
} from './interfaces';

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
    const knownChannelName = ['eng-all', 'announcements-syd', 'announcements-global', 'hackathon-2020', 'sentiminder-hackathon-2020', 'guild-frontend',
      'guild_infra_tech', 'stayingsocial'];
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

  async fetchMessages(ops: IFetchMessagesRequest) {
    const requestConfig: any = {
      token: this.slackBotToken,
      channel: ops.id,
      inclusive: false,
      limit: ops.limit || 100,
    };
    // if no ts then grab from the last 30 days
    if (ops.ts) {
      if (ops.fetchOnward) {
        requestConfig.oldest = Math.trunc(ops.ts * 10) / 10000;
      } else {
        requestConfig.latest = Math.trunc(ops.ts * 10) / 10000;
      }
    }

    const result: any = await this.app.client.conversations.history(requestConfig);
    const res: IFetchMessagesResponse = {
      hasMore: result.has_more,
      nextTs: ops.ts,
      messages: result.messages,
      nextCursor: result.response_metadata?.next_cursor,
    };

    res.messages.forEach((message) => {
      // eslint-disable-next-line no-param-reassign
      message.ts = parseFloat(message.ts as any) * 1000;
      if (ops.fetchOnward && message.ts > res.nextTs) {
        res.nextTs = message.ts;
      }
      if (!ops.fetchOnward && message.ts < res.nextTs) {
        res.nextTs = message.ts;
      }
    });
    if (ops.fetchOnward) {
      res.messages = res.messages.filter((t) => t.ts > ops.ts);
    }
    if (!ops.fetchOnward) {
      res.messages = res.messages.filter((t) => t.ts < ops.ts);
    }

    return res;
  }
}

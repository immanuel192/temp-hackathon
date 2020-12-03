// eslint-disable-next-line import/no-extraneous-dependencies
import { IChannelRecord } from '@/share';
import { WebAPICallResult } from '@slack/web-api';

export interface ISlack {
  init(): void;
  getAllChannels(): Promise<IChannelRecord[]>;
  fetchMessages(ops: IFetchMessagesRequest): Promise<IFetchMessagesResponse>;
}

export type IChannelListResponse = WebAPICallResult & {
  channels: {
    id: string;
    name: string;
    is_channel: boolean;
    is_group: boolean;
    is_im: boolean;
    is_member: boolean;
    is_private: boolean;
    is_mpim: boolean;
    last_read: string;
  }[];
}

export interface ISlackMessage {
  type: string;
  user: string;
  text: string;
  ts: number;
}

export interface IFetchMessagesRequest {
  id: string;
  ts?: number;
  limit?: number;
  /**
   * fetch messages onward or backward
   */
  fetchOnward?: boolean;
}

export type IFetchMessagesResponse = {
  hasMore: boolean;
  nextTs: number;
  nextCursor: string;
  messages: ISlackMessage[];
}

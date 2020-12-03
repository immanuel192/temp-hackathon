// eslint-disable-next-line import/no-extraneous-dependencies
import { IChannelRecord } from '@/share';
import { WebAPICallResult } from '@slack/web-api';

export interface ISlack {
  getAllChannels(): Promise<IChannelRecord[]>;
  fetchMessages(id, ts): Promise<any>;
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

export interface IFetchMessagesRequest {
  id: string;
  ts?: number;
  limit?: number;
}

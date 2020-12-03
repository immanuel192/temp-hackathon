import { IChannelRecord, IComprehendScore } from '@/share';

export interface IFireStore {
  init(): void;
  getChannels(): Promise<IChannelRecord[]>;
  getChannelById(channelId: string): Promise<IChannelRecord>;
  updateChannelLastRead(channelId: string, newTs: number): Promise<void>;
  addMessageScore(sentimentScore: IComprehendScore, channelId: string);
}

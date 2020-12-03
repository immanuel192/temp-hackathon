export interface IComprehendScore {
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED" | string;
  mixed: number;
  positive: number;
  neutral: number;
  negative: number;
}

/**
 * An interface for the record in collection messagesentiments
 * All fields will be indexed
 */
export interface IMessageSentimentRecord {
  id?: string;
  ts: Date;
  // for easy data query
  tsDetail: {
    year: number;
    month: number;
    day: number;
  };
  channelId: string;
  sentimentScore: IComprehendScore;
  languageCode: string;
}

/**
 * An interface for the channel record, in collection channels
 */
export interface IChannelRecord {
  id?: string;
  channelId: string;
  name: string;
  isChannel: boolean;
  isPrivate: boolean;
  lastRead?: number; // Unix ts
}

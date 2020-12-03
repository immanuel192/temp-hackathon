import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

import { IChannelRecord, IComprehendScore, IMessageSentimentRecord } from '@/share';
import { IFireStore } from './interface';

const serviceAccount = "key.json";

export class FireStore implements IFireStore {
  private db: Firestore

  init() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://dev-sentiminder.firebaseio.com",
    });

    this.db = admin.firestore();
  }

  async getChannels(): Promise<IChannelRecord[]> {
    const channels = await this.db.collection('channels').get();
    return channels.docs.map((t) => {
      const data = t.data() as IChannelRecord;
      return {
        id: t.id,
        ...data,
      };
    });
  }

  async getChannelById(channelId: string): Promise<IChannelRecord> {
    const docs = await this.db.collection('channels')
      .where('channelId', '==', channelId)
      .limit(1)
      .get();
    if (docs.empty) {
      return null;
    }
    const data = docs.docs[0].data() as IChannelRecord;
    return {
      id: docs.docs[0].id,
      ...data,
    };
  }

  async updateChannelLastRead(channelId: string, newTs: number) {
    const channel = await this.getChannelById(channelId);
    if (!channel) {
      throw new Error(`Channel ${channelId} not found`);
    }
    await this.db.collection("channels").doc(channel.id).update({
      lastRead: newTs,
    });
  }

  async addMessageScore(sentimentScore: IComprehendScore, channelId: string, ts: Date) {
    const record: IMessageSentimentRecord = {
      ts,
      // for easy data query
      tsDetail: {
        year: ts.getUTCFullYear(),
        month: ts.getUTCMonth(),
        day: ts.getUTCDate(),
      },
      channelId,
      sentimentScore,
      languageCode: 'en',
    };
    await this.db.collection("messagesentiments").add(record);
  }
}

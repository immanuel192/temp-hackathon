import './services/config';
import { config } from 'aws-sdk';

import path from 'path';
import fs from 'fs';
import { Slack } from './services/slack';
import { ISlackMessage } from './services/interfaces';
import Bottleneck from 'bottleneck'

const fsPromise = fs.promises;

config.update({ region: 'eu-west-1' }); // Whatever region for now.

const now = (new Date()).getTime() * 1000;
const firstOf2020 = 1577836800 * 1000;
const firstOf2015 = 1420070400 * 1000;
const firstOf2010 = 1262304000 * 1000;
const firstOf2005 = 1104537600 * 1000;

const bottleLimiter = new Bottleneck({
  minTime: 12000, // 50 per minute
})

let requestCount = 0

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

const writeToFile = async (fileName: string, messages: ISlackMessage[]) => {
  const filePath = path.join(process.cwd(), 'src/backend/historical-data', `${fileName}.json`);

  try {
    const messagesWithConvertedTime = messages.map((m) => ({ ...m, d: new Date(m.ts) }));
    await fsPromise.appendFile(filePath, JSON.stringify(messagesWithConvertedTime, null, 2));
  } catch (err) {
    console.log(err);
  }
};

const transformMessages = (messages: ISlackMessage[]) => messages.map((m) => ({
  type: m.type,
  user: m.user,
  text: m.text,
  ts: m.ts,
})).sort((m1, m2) => m2.ts - m1.ts);

const fetchHistoricalData = async (slack: Slack, channelId: string, channelName: string) => {
  let tsCursor = now
  let allMessages: ISlackMessage[] = []

  while (tsCursor > firstOf2015) {
    try {
      const { messages, nextTs } = await slack.fetchMessages({
        id: channelId,
        fetchOnward: false,
        ts: tsCursor,
        limit: 200,
      })

      requestCount += 1

      console.log(`Fetch ${messages.length} messages at ${new Date(tsCursor)} for channel ${channelName}`);

      if (messages.length === 0) {
        break;
      }

      allMessages = [...allMessages, ...transformMessages(messages)];

      tsCursor = nextTs;

      // This doesn't seem to work, cry
      if (requestCount === 50) {
        requestCount = 0
        console.log('====================Sleep====================')
        await sleep(60 * 1000)
      }
    } catch (err) {
      console.log('Err', err);
    }
  }

  await writeToFile(channelName, allMessages);
}

Promise.resolve()
  .then(async () => {
    const slack = new Slack();
    slack.init();

    const allChannels = await slack.getAllChannels()

    // for (let i = 0; i < allChannels.length; i++) {
    //   await fetchHistoricalData(slack, allChannels[i].channelId, allChannels[i].name)
    // }

    await Promise.all(allChannels.map(async c => {
      await fetchHistoricalData(slack, c.channelId, c.name)
    }))
  });

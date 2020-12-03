import './services/config';
import { config } from 'aws-sdk';
import { sortBy } from 'lodash';

import path from 'path';
import fs from 'fs';
import { channels } from './historical-data/channels';
import { Slack } from './services/slack';
import { ISlackMessage } from './services/interfaces';

const fsPromise = fs.promises;

config.update({ region: 'eu-west-1' }); // Whatever region for now.

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
})).sort((m1, m2) => m1.ts - m2.ts);

Promise.resolve()
  .then(async () => {
    const slack = new Slack();
    slack.init();

    let tsCursor = 1606886139.024300 * 1000;
    const firstOfNov = 1604212301 * 1000;

    while (tsCursor > firstOfNov) {
      try {
        const { messages, nextTs } = await slack.fetchMessages({
          id: channels[0].channelId,
          fetchOnward: false,
          ts: tsCursor,
          limit: 50,
        });

        console.log(`Receive ${messages.length} messages at ${new Date(tsCursor)}`);
        console.log(`Next ts = ${new Date(nextTs)}`);

        await writeToFile(channels[0].name, transformMessages(messages));

        tsCursor = nextTs;
      } catch (err) {
        console.log('Err', err);
      }
    }
  });

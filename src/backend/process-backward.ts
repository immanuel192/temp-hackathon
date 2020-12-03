import './services/config';
import { config } from 'aws-sdk';
import { Slack } from './services/slack';
import AWSComprehend from "./services/comprehend";

config.update({ region: 'eu-west-1' }); // Whatever region for now.

Promise.resolve()
  .then(async () => {
    const slack = new Slack();
    slack.init();
    const messages = await slack.fetchMessages({
      id: 'G01F74EUWA3',
      fetchOnward: false,
      ts: 1606886139.024300,
      limit: 10,
    });

    console.log(messages);
  });

import './services/config';
import { Slack } from './services/slack';

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

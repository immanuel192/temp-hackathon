import { ISlack } from './interfaces';

export class Slack implements ISlack {
  // eslint-disable-next-line class-methods-use-this
  test() {
    console.log('t');
  }
}

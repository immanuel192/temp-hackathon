import { TSFlag } from 'ts-flag';

export const getCliArgs = () => {
  const flag = new TSFlag();
  return {
    tsFlag: flag,
    channel: flag.str('channel', null, 'channel Id'),
    keep: flag.bool('interact', false, 'keep interacting with terminal'),
    direction: flag.str('direction', 'onward', 'onward or backward') as 'onward' | 'backward',
    help: flag.bool('help', true, 'show usage'),
  };
};

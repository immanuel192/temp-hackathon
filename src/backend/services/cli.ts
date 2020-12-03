import parser from 'yargs-parser';

export const getCliArgs = () => {
  const flags = parser(process.argv.slice(2));

  return {
    channel: flags.channel,
    keep: flags.interact === 'true',
    direction: flags.direction || 'onward' as 'onward' | 'backward',
    help: flags.help,
  };
};

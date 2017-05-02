// @flow

/* exlint no-console: 0 */

import program from 'commander';
import converter from '..';

program
  .version('1.0.0')
  .arguments('<playlist> <blocks> <output>')
  .action((playlist, blocks, output) => {
    converter(playlist || program.playlist, blocks || program.blocks,
      output || program.output, program.config);
  })
  .description('Generate plx file for V-BOX.')
  .option('-p, --playlist [path]', 'playlist file')
  .option('-b, --blocks [path]', 'regional blocks file')
  .option('-o, --output [path]', 'output file')
  .option('-c, --config [path]', 'config file');

program.parse(process.argv);

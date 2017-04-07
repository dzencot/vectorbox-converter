// @flow

import fs from 'mz/fs';

export default async () => {
  const configFile = await fs.readFile('./src/config.json');
  const config = JSON.parse(configFile);
  return config;
};


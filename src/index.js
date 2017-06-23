// @flow

import xlsx from 'xlsx';
import xmlbuilder from 'xmlbuilder';
import debug from 'debug';
import fs from 'mz/fs';
import { addTime, getFormattedTime } from './lib/mathTime';
import getRecBlocks from './lib/getRecBlocks';
import getLiveBlocks from './lib/getLiveBlocks';
import getVBoxPL from './lib/getVBoxPL';

const debugRecBlocks = debug('converter:recBlocks');
const debugApp = debug('converter:app');
const debugConfig = debug('converter:config');

const getSheetRecBlocks = async (filePath, config) => {
  const worksheetName = config.NameSheet;
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[worksheetName];
  const recBlocks = await getRecBlocks(worksheet, config);
  return recBlocks;
};

const getSheetLiveBlocks = (filePath, config) => {
  const workbook = xlsx.readFile(filePath, { cellStyles: true });
  const worksheetName = workbook.SheetNames[0];
  return getLiveBlocks(workbook.Sheets[worksheetName], config);
};

const getDurationPlaylist = playlist => playlist.reduce((acc, item) => {
  let duration;
  if (item.ExternalItem) {
    duration = item.ExternalItem.MSS.Duration;
  } else if (item.Item) {
    duration = getFormattedTime(item.Item.Title.Duration);
  }
  return addTime(acc, duration);
}, '00:00:00:00');

const getXmlResult = (resultIn) => {
  const result = resultIn;
  if (result[0].ExternalItem) {
    result[0].ExternalItem.FixedTime = 'TRUE';
  } else if (result[0].Item) {
    result[0].Item.FixedTime = 'TRUE';
  }
  const xmlResult = xmlbuilder.create('PlayList');
  xmlResult.ele({ ExportedBy: 'DZENCOT CONVERTER (REGIONAL)' });
  xmlResult.ele({ ListDuration: getDurationPlaylist(result) });
  xmlResult.ele({ CatalogueDir: 'Catalogue' });
  xmlResult.ele({ StorageUnits: { UnitPath: 'D:' } });
  result.forEach(key => xmlResult.ele(key));
  xmlResult.end({ pretty: true });
  return xmlResult;
};

export default async (filePathLive, filePathBlocks, pathResult = './output.plx', pathConfig = './src/config.json') => {
  const config = await fs.readFile(pathConfig).then(data => JSON.parse(data));
  debugConfig('config:', config);
  debugApp(pathResult);
  const recBlocks = await getSheetRecBlocks(filePathBlocks, config.RegionalBlocks);
  debugRecBlocks(recBlocks);
  const liveBlocks = await getSheetLiveBlocks(filePathLive, config.LivePlayList);
  const result = await getVBoxPL(recBlocks, liveBlocks);
  const xmlResult = getXmlResult(result);
  return fs.writeFile(pathResult, `\ufeff<?xml version="1.0" encoding="UTF-16"?>\n${xmlResult}`, { encoding: 'utf16le' });
};


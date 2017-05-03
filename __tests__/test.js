// @flow

import fs from 'mz/fs';
import os from 'os';
import xml from 'xml2js';
import path from 'path';
import converter from '../src';
import { addTime, subTime } from '../src/lib/mathTime';

describe('test MathTime', () => {
  it('test MathTime.add', () => {
    const firstTime = '00:01:45:10';
    const secondTime = '00:59:15:15';
    expect(addTime(firstTime, secondTime)).toBe('01:01:01:00');

    const thirdTime = '59:59:59:24';
    const fourthTime = '00:00:00:01';
    expect(addTime(thirdTime, fourthTime)).toBe('60:00:00:00');
  });

  it('test MathTime.sub', () => {
    const firstTime = '01:02:15:10';
    const secondTime = '00:02:15:15';
    expect(subTime(firstTime, secondTime)).toBe('00:59:59:20');

    const thirdTime = '01:10:00:00';
    const fourthTime = '01:10:00:01';
    expect(subTime(thirdTime, fourthTime)).toBe('-00:00:00:01');
  });
});

const getXmlData = async (pathFile) => {
  let result;
  const fileResult = fs.readFileSync(pathFile, 'ucs2');
  xml.parseString(fileResult, (err, data) => {
    if (err) {
      throw err;
    }
    result = data;
    return true;
  });
  return result;
};

describe('test converter', () => {
  let tempDir;
  let pathResult;
  let expectData;

  beforeAll(async () => {
    tempDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
    pathResult = path.resolve(tempDir, 'output.xml');
    expectData = await getXmlData('./__tests__/__fixtures__/testVB.xml');
  });

  it('test plx', (done) => {
    const filePathRecBlock = './__tests__/__fixtures__/testRegionalList.xlsx';
    const filePathLive = './__tests__/__fixtures__/testPlaylist.xlsx';
    const fileConfig = './__tests__/__fixtures__/config.json';
    converter(filePathLive, filePathRecBlock, pathResult, fileConfig)
    .then(async () => {
      const xmlResult = await getXmlData(pathResult);
      expect(xmlResult).toEqual(expectData);
      done();
    })
    .catch(done.fail);
  });
});

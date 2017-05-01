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

const getListDuration = async (pathFile) => {
  let result;
  const fileResult = fs.readFileSync(pathFile, 'ucs2');
  await xml.parseString(fileResult, (err, data) => {
    if (err) {
      throw err;
    }
    result = data.PlayList.ListDuration[0];
    return true;
  });
  return result;
};

describe('test converter', () => {
  let tempDir;
  let pathResult;
  let expectResult;

  beforeAll(async () => {
    tempDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
    pathResult = path.resolve(tempDir, 'output.xml');
    expectResult = await getListDuration('./__tests__/__fixtures__/testVB.xml');
  });

  it('test plx', (done) => {
    const filePathRecBlock = './__tests__/__fixtures__/testRegionalList.xlsx';
    const filePathLive = './__tests__/__fixtures__/testPlaylist.xlsx';
    converter(filePathLive, filePathRecBlock, pathResult)
    .then(async () => {
      const result = await getListDuration(pathResult);
      expect(result).toEqual(expectResult);
      done();
    })
    .catch(done.fail);
  });
});

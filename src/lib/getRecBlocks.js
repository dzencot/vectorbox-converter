// @flow

import path from 'path';
import fs from 'mz/fs';
import debug from 'debug';
import xml from 'xml2js';
import { addTime } from './mathTime';

const filesDebug = debug('converter:files');
const xmlDebug = debug('converter:xml');
const configDebug = debug('converter:config');

export default async (sheet, {
  NumberBlockColumn = 'E',
  NumberRolickColumn = 'A',
  IdRolickColumn = 'B',
  NameRolickColumn = 'C',
  DurationRolickColumn = 'D',
  ValueNotInclude = 'Нет размещений',
  PathFilesBXX = './__tests__/__fixtures__',
}) => {
  const numberBlockColumn = NumberBlockColumn;
  const numberRolickColumn = NumberRolickColumn;
  const idRolickColumn = IdRolickColumn;
  const nameRolickColumn = NameRolickColumn;
  const durationRolickColumn = DurationRolickColumn;
  const valueNotInclude = ValueNotInclude;
  const pathFilesBXX = PathFilesBXX;
  const maxRow = sheet['!ref'].split(':')[1].replace(/[^-0-9]/gim, '');
  configDebug(numberBlockColumn,
    numberRolickColumn,
    idRolickColumn,
    nameRolickColumn,
    durationRolickColumn,
    valueNotInclude,
    pathFilesBXX);

  const getFactDuration = async (id) => {
    const file = await fs.readFile(path.resolve(pathFilesBXX, `${id}.BXX`), 'ucs2');
    filesDebug(file);
    let result;
    let frames;
    await xml.parseString(file, (err, data) => {
      if (err) {
        throw err;
      }
      xmlDebug(data);
      result = data.V3Clip.Duration[0];
      frames = data.V3Clip.VideoStream[0].VideoStreamElement[0].DataRate[0] || 1;
      return true;
    });
    return result / frames;
  };


  const getRolicks = async (numRow, accIn = {}) => {
    const acc = accIn;
    const numRolick = sheet[`${numberRolickColumn}${numRow}`];
    if (numRolick === undefined || numRow >= maxRow) {
      return acc;
    }
    const id = sheet[`${idRolickColumn}${numRow}`].v;
    const duration = sheet[`${durationRolickColumn}${numRow}`].w;
    const factDuration = await getFactDuration(id);
    if (Number(duration) !== factDuration) {
      throw new Error(`Duration ${id} : ${duration}, fact: ${factDuration}`);
    }
    acc[numRolick.v] = {
      id,
      name: sheet[`${nameRolickColumn}${numRow}`].v,
      duration: sheet[`${durationRolickColumn}${numRow}`].w,
    };
    return getRolicks(numRow + 1, acc);
  };

  const getBlocks = async (numRow, accIn = {}) => {
    const acc = accIn;
    if (numRow > maxRow) {
      return acc;
    }
    const blockCell = sheet[`${numberBlockColumn}${numRow}`];
    if (blockCell && blockCell.t === 'n' && !/\D/.test(blockCell.w)) {
      const number = blockCell.v;
      const include = sheet[`${nameRolickColumn}${numRow}`] === undefined ||
        sheet[`${nameRolickColumn}${numRow}`].v !== valueNotInclude;
      const rolicks = include ? await getRolicks(numRow + 1) : {};
      const duration = Object.keys(rolicks).reduce((acc1, key) => addTime(acc1, `${rolicks[key].duration}:00`), '00:00:00:00');
      acc[number] = {
        active: include,
        duration,
        rolicks,
      };
      return getBlocks(numRow + Object.keys(rolicks).length + 1, acc);
    }
    return getBlocks(numRow + 1, acc);
  };
  const result = await getBlocks(1);
  return result;
};


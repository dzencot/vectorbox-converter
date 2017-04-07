// @flow

import debug from 'debug';
import { addTime } from './mathTime';

const debugGetLiveBlocks = debug('converter:getLiveBlocks');
const debugSearchBlocks = debug('converter:searchBlocks');

export default async (sheet, {
  TimeColumn = 'A',
  NameColumn = 'B',
  DurationColumn = 'C',
  ColorRegRec = '00FF00',
}) => {
  const maxRow = sheet['!ref'].split(':')[1].replace(/[^-0-9]/gim, '');
  const timeColumn = TimeColumn;
  const nameColumn = NameColumn;
  const durationColumn = DurationColumn;
  const colorRegRec = ColorRegRec;
  debugGetLiveBlocks(
    'timeColumn = ', timeColumn,
    'nameColumn = ', nameColumn,
    'durationColumn = ', durationColumn,
    'colorRegRec = ', colorRegRec,
  );

  const getLine = async (numRow) => {
    const cellName = sheet[`${nameColumn}${numRow}`];
    const cellTime = sheet[`${timeColumn}${numRow}`];
    const cellTimeKeeping = sheet[`${durationColumn}${numRow}`];
    const fgColor = cellName && cellName.s ? cellName.s.fgColor.rgb : undefined;
    return {
      name: cellName,
      time: cellTime,
      duration: cellTimeKeeping,
      fgColor,
    };
  };


  const getBlock = async (numRow, accIn = {}) => {
    const acc = accIn;
    const line = await getLine(numRow);
    if (numRow >= maxRow || line.fgColor !== colorRegRec) {
      return acc;
    }
    const number = Object.keys(acc).length + 1;
    acc[number] = {
      row: numRow,
      rolik: {
        name: line.name.v,
        time: line.time.w,
        duration: line.duration.w,
      },
    };
    return getBlock(numRow + 1, acc);
  };

  const iter = async (numRow, accIn = {}) => {
    const acc = accIn;
    if (numRow > maxRow) {
      return acc;
    }
    const line = await getLine(numRow);
    if (line.name && line.time && line.duration && line.time.t === 'n') {
      if (line.fgColor === colorRegRec) {
        const lines = await getBlock(numRow);
        debugSearchBlocks('I got old lines');
        debugSearchBlocks(lines);
        const numBlock = Object.keys(acc)
          .reduce((acc1, key) => {
            const res = acc[key].block ? acc1 + 1 : acc1;
            return res;
          }, 0) + 1;
        const duration = Object.keys(lines)
          .reduce((acc1, key) => addTime(acc1, lines[key].rolik.duration), '00:00:00:00');
        debugSearchBlocks(`I found block #${numBlock} in line ${numRow}`);
        acc[numRow] = {
          block: {
            number: numBlock,
            time: line.time.w,
            duration,
            name: 'Региональный блок',
            oldLines: lines,
          },
        };
        return iter(numRow + Object.keys(lines).length, acc);
      }
      acc[numRow] = {
        rolik: {
          name: line.name.v,
          time: line.time.w,
          duration: line.duration.w,
        },
      };
    }
    return iter(numRow + 1, acc);
  };
  const result = iter(1);
  return result;
};

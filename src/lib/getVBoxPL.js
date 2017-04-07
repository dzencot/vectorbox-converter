// @flow

export default (regionalBlocks, playlist) => {
  let VBUniqueId = 0;
  const countRegBlocks = Object.keys(regionalBlocks).length;
  const countLiveBlocks = Object.keys(playlist).filter(key => playlist[key].block).length;
  if (countRegBlocks !== countLiveBlocks) {
    throw new Error(`Regional blocks = ${countRegBlocks}. Blocks in federal = ${countLiveBlocks}`);
  }
  const getLine = (line, { regional = false, FixedTime = 'FALSE' } = {}) => {
    VBUniqueId += 1;
    if (regional === false) {
      return {
        ExternalItem: {
          VBUniqueId,
          FixedTime,
          StartTime: line.rolik.time,
          MSS: {
            Name: 'ТНТ',
            Caption: line.rolik.name,
            Duration: line.rolik.duration,
            LiveSourceID: 2,
          },
        },
      };
    }
    return {
      Item: {
        VBUniqueId,
        StartTime: line.time,
        Title: {
          TitleId: line.id,
          FilePath: 'test',
          TitleType: 'Video',
          Caption: line.name,
          Duration: line.duration * 25,
        },
        CGInformation: {
          CGAutoSelect: 'TRUE',
        },
        Transition: {
          AutoSelect: 'TRUE',
        },
      },
    };
  };

  const result = Object.keys(playlist).reduce((acc, key) => {
    const numberBlock = playlist[key].block ? playlist[key].block.number : undefined;
    if (numberBlock) {
      const rolicks = regionalBlocks[numberBlock].active ?
        regionalBlocks[numberBlock].rolicks :
        playlist[key].block.oldLines;
      Object.keys(rolicks)
        .forEach(key1 => acc
          .push(getLine(rolicks[key1], { regional: regionalBlocks[numberBlock].active })));
      return acc;
    }
    acc.push(getLine(playlist[key]));
    return acc;
  }, []);
  return result;
};

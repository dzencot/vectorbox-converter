// @flow

const baseTime = 60;
const baseFrames = 25;
const balancer = (arrTime1, arrTime2) => {
  if (arrTime1.length === arrTime2.length) {
    return [arrTime1, arrTime2];
  }
  if (arrTime1.length > arrTime2.length) {
    arrTime2.push('00');
  } else {
    arrTime1.push('00');
  }
  return balancer(arrTime1, arrTime2);
};

const getFramesTime = (currentArr) => {
  const iter = (arr, acc = 0) => {
    if (arr.length === 0) {
      return acc;
    }
    const current = +arr.shift();
    return iter(arr, (acc + current) * baseTime);
  };
  const frames = +currentArr.pop();
  const seconds = +currentArr.pop();
  const allSeconds = iter(currentArr) + seconds;
  const result = frames + (allSeconds * baseFrames);
  return result;
};

export const getFormattedTime = (frames, format = 'hh:mm:ss:ff') => {
  const iter = (num, acc) => {
    if (acc.length + 1 === format.split(':').length) {
      acc.unshift(num.toString());
      return acc;
    }
    const ostatok = num % baseTime;
    const currentNum = (num - ostatok) / baseTime;
    acc.unshift(ostatok.toString());
    return iter(currentNum, acc);
  };
  const currentFrames = frames % baseFrames;
  const result = iter((frames - currentFrames) / baseFrames, [currentFrames.toString()])
  .map((number) => {
    const res = number.length < 2 ? `0${number}` : number;
    return res;
  })
  .join(':');
  return result;
};

export const addTime = (time1, time2) => {
  const frames1 = getFramesTime(time1.split(':'));
  const frames2 = getFramesTime(time2.split(':'));
  return getFormattedTime(frames1 + frames2);
};

export const subTime = (time1, time2) => {
  const frames1 = getFramesTime(time1.split(':'));
  const frames2 = getFramesTime(time2.split(':'));
  if (frames2 > frames1) {
    return `-${getFormattedTime(frames2 - frames1)}`;
  }
  return getFormattedTime(frames1 - frames2);
};


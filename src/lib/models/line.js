class Line {

  constructor(name, time, duration, fgColor) {
    this.name = name;
    this.time = time;
    this.duration = duration;
    this.fgColor = fgColor;
  }

  getName() {
    return this.name;
  }

  getTime() {
    return this.time;
  }

  getDuration() {
    return this.duration;
  }

  getFgColor() {
    return this.fgColor;
  }
}

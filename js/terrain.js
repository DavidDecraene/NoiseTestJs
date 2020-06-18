/*jshint esversion: 9 */



class Terrain {
  constructor(detail) {
    this.size = detail * detail + 1;// Math.pow(2, detail) + 1;
    console.log(this.size, detail);
    this.max = this.size - 1;
    this.map = [];
  }

  get(x, y) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) return -1;
    const r = this.map[x + this.size * y];
    if (r === undefined) return 0;
    return r;
  }

  set(x, y, val) {
    this.map[x + this.size * y] = val;

  }

  draw(ctx,  width, height, fn) {
    var self = this;
    var xx = 0;
    var waterVal = this.size * 0.3;
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        var val = fn(x, y);
        var top = project(x, y, val);
        var bottom = project(x + 1, y, 0);
        var water = project(x, y, waterVal);
        var style = brightness(x, y, fn(x + 1, y) - val);
        rect(top, bottom, style);
        // rect(water, bottom, 'rgba(50, 150, 200, 0.15)');
      }
    }
    function rect(a, b, style) {
      if (b.y < a.y) return;
      ctx.fillStyle = style;
      ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
    }
    function brightness(x, y, slope) {
      if (y === self.max || x === self.max) return '#000';
      var b =  ~~(slope * 50) + 128;
      if (b < 0 ) b = 0;
      // var b = ~~(slope * 50) + 128;
      return ['rgba(', b, ',', b, ',', b, ',1)'].join('');
    }
    function iso(x, y) {
      return {
        x: 0.5 * (self.size + x - y),
        y: 0.5 * (x + y)
      };
    }
    function project(flatX, flatY, flatZ) {
      var point = iso(flatX, flatY);
      var x0 = width * 0.5;
      var y0 = height * 0.2;
      var z = self.size * 0.5 - flatZ + point.y * 0.75;
      var x = (point.x - self.size * 0.5) * 6;
      var y = (self.size - point.y) * 0.005 + 1;
      return {
        x: x0 + x / y,
        y: y0 + z / y
      };
    }
  }
}

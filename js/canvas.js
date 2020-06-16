/*jshint esversion: 6 */
// jshint ignore: start
class JQ {
    appendTo($element) {
      if ($element instanceof JQ) {
        $element = $element.$element;
      }
      this.$element.appendTo($element);
      return this;
    }

    append($element) {
      if ($element instanceof JQ) {
        $element = $element.$element;
      }
      this.$element.append($element);
      return this;
    }
  }

class Canvas extends JQ  {

  constructor(scale = 1, opts = {}) {
    super();

    this.options = { ... {
      rotation: 0,
      editor: false,
      w: 32, h: 32,
      transparent: '#fff', createElement: false,
      x: 0, y: 0}, ... opts };
    this.scale = scale;
    if (this.options.createElement) {
      this.$element = $('<canvas/>').attr('width', this.scale  * this.width)
        .attr('height', this.scale  * this.height);
      this.canvas = this.$element.get(0);
      this.ctx = this.canvas.getContext("2d");
    }
  }

  draw(pix){

      for(var x =0 ; x < pix.length; x++) {
        const row = pix[x];
        if (!row) { continue; }
        for(var y = 0; y < row.length; y++) {
          const data = row[y];
          if (!data) { continue; }
          const xR = x * this.scale ;
          const yR = y * this.scale ;
          if (data.clear) {
            this.ctx.clearRect(xR, yR, this.scale, this.scale);
          } else {
            this.ctx.fillStyle = data.color;
            this.ctx.fillRect(xR, yR, this.scale, this.scale);
          }
        }
      }

  }




  get width() {
    return this.options.w;
  }

  get transparentColor() {
    return this.optionstransparentw;
  }

  get height() {
    return this.options.h;
  }
}

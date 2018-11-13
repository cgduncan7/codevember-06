/**
 * sketch
 */
var s = function(sketch) {
  // #region settings
  const framerate = 60;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // #endregion

  var web;

  // #region p5
  sketch.setup = function() {
    const p5canvas = sketch.createCanvas(w, h);
    canvas = p5canvas.canvas;
    web = new Web(sketch, 10, 5);
    web.generate();
    sketch.frameRate(framerate);
  }

  sketch.draw = function() {
    sketch.background(255, 255, 255, 80);
    web.draw();
  }
  // #endregion
};

var sketch = new p5(s, document.getElementById('sketch'));
import { ReactP5Wrapper } from '@p5-wrapper/react';
import * as p from '@p5-wrapper/react';
import monoRegular from './fonts/Mono-Regular.ttf';

function sketch(p5: p.P5CanvasInstance) {
  let font: any;

  p5.preload = () => {
    font = p5.loadFont(monoRegular);
  };

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight, p5.WEBGL);
    p5.textSize(32);
    p5.textFont(font);
  };

  window.addEventListener('resize', () => {
    p5.resizeCanvas(innerWidth, innerHeight, p5.WEBGL);
  });

  p5.draw = () => {
    p5.background(102);
    p5.push();
    p5.translate(20 * 0.8, 20 * 0.5);
    p5.rotate(p5.frameCount / -100.0);
    star(0, 0, 30, 70, 5);
    p5.pop();

    p5.text('WAAW', -20, -90);
  };

  function star(
    x: number,
    y: number,
    radius1: number,
    radius2: number,
    npoints: number
  ) {
    const TWO_PI = 6.283185307179586;
    const angle = TWO_PI / npoints;
    const halfAngle = angle / 2.0;
    p5.beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + p5.cos(a) * radius2;
      let sy = y + p5.sin(a) * radius2;
      p5.vertex(sx, sy);
      sx = x + p5.cos(a + halfAngle) * radius1;
      sy = y + p5.sin(a + halfAngle) * radius1;
      p5.vertex(sx, sy);
    }
    p5.endShape('close');
  }
}

const App = () => {
  return <ReactP5Wrapper sketch={sketch} />;
};

export default App;

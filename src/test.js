import { createCanvas } from 'p5';

let ball;

console.log('hey');

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  ball = new Ball();

  if (window.DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
    const startButton = createButton('Press to start')
      .addClass('start-button')
      .mousePressed(() => {
        requestDeviceMotionPermission();
        createSensorValueDisplay();
        startButton.hide();
      });
    startButton.position((width - startButton.elt.clientWidth) / 2, 50);
  } else if (true) {
    setInterval(() => {
      const accelerationIncludingGravity = {
        x: 8 * noise(frameCount / 100, 0) - 4,
        y: 8 * noise(frameCount / 150, 1) - 4,
      };
      handleMotion({ accelerationIncludingGravity });
    }, 1000 / 60);
  } else {
    console.log('nah');
  }
}

function requestDeviceMotionPermission() {
  if (window.DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
    DeviceMotionEvent.requestPermission().then(() => {
      window.addEventListener('devicemotion', handleMotion, true);
      window.addEventListener('deviceorientation', handleOrientation);
    });
  } else if (window.DeviceMotionEvent) {
    window.ondevicemotion = handleMotionData;
  }
}

function handleMotion(data) {
  const g = data.accelerationIncludingGravity;
  const a = createVector(g.x, -g.y).mult(0.5);
  ball.accelerate(a);
}

/*
 * Objects
 */

class Ball {
  constructor() {
    this.radius = 15;
    this.pos = createVector(width, height).mult(0.5);
    this.vel = createVector();
    this.angle = 0;
    this.rotationSpeed = 1;
  }

  accelerate(acc) {
    ball.vel.add(acc);
  }

  update() {
    const { pos, vel, radius } = this;
    const margin = 1 / 2;

    // update the ball position
    vel.mult(0.9);
    pos.add(vel);

    // bounce the ball off the sides
    const topLeft = p5.Vector.sub(
      pos,
      createVector(radius + margin, radius + margin)
    );
    const botRight = p5.Vector.add(
      pos,
      createVector(radius + margin, radius + margin)
    );
    if ((topLeft.x < 0 || width <= botRight.x) && topLeft.x * vel.x > 0) {
      pos.x = vel.x < 0 ? radius + margin : width - radius - margin;
      this.rotationSpeed = vel.y / radius;
      if (topLeft.x > 0) {
        this.rotationSpeed *= -1;
      }
    }
    if ((topLeft.y < 0 || height <= botRight.y) && topLeft.y * vel.y > 0) {
      pos.y = vel.y < 0 ? radius + margin : height - radius - margin;
      this.rotationSpeed = vel.x / radius;
      if (topLeft.y < 0) {
        this.rotationSpeed *= -1;
      }
    }
    this.angle += this.rotationSpeed;
    this.rotationSpeed *= 0.99;
  }

  draw() {
    const { pos, radius } = this;
    const dotRadius = 6;
    const dotPos = p5.Vector.add(
      pos,
      p5.Vector.fromAngle(this.angle, radius - dotRadius)
    );

    circle(pos.x, pos.y, 2 * radius);
    circle(dotPos.x, dotPos.y, 2 * dotRadius);
  }
}

setup();

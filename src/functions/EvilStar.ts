import { getRandomNumber } from './getRandomNumber';
import p5Type from 'p5';

export class EvilStar {
  xPos: number;
  initialX: number;
  initialY: number;
  yPos: number;
  p5: p5Type;
  shouldAnimate = true;
  closeRadius = 10;
  farRadius = 33;
  xSpeed = 4;
  ySpeed = 3;
  powerUps: EvilPowerUp[];

  constructor(xPos: number, yPos: number, p5: p5Type, powerUps: EvilPowerUp[]) {
    this.xPos = xPos;
    this.initialX = xPos;
    this.yPos = yPos;
    this.initialY = yPos;
    this.p5 = p5;
    this.powerUps = powerUps;
  }

  reset() {
    this.xPos = this.initialX;
    this.yPos = this.initialY;
    this.shouldAnimate = true;
    this.powerUps.forEach((powerUp) => {
      powerUp.shouldAnimate = true;
      powerUp.shouldDraw = false;
    });
  }

  draw = (): {
    x: number;
    y: number;
  }[] => {
    this.p5.push();

    if (this.shouldAnimate) {
      this.p5.translate(this.xPos, this.yPos);
      this.p5.rotate(this.p5.frameCount / 50.0);
      this.p5.translate(-this.xPos, -this.yPos);
    }

    this.p5.stroke('white');
    this.p5.fill('black');
    const x = this.xPos;
    const y = this.yPos;
    const radius1 = this.closeRadius;
    const radius2 = this.farRadius;
    const npoints = 5;
    const TWO_PI = 2 * Math.PI;
    const angle = TWO_PI / npoints;
    const halfAngle = angle / 2.0;

    const vertices = [];
    this.p5.beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + this.p5.cos(a) * radius2;
      let sy = y + this.p5.sin(a) * radius2;
      vertices.push({ x: sx, y: sy });
      this.p5.vertex(sx, sy);
      sx = x + this.p5.cos(a + halfAngle) * radius1;
      sy = y + this.p5.sin(a + halfAngle) * radius1;
      vertices.push({ x: sx, y: sy });
      this.p5.vertex(sx, sy);
    }
    this.p5.endShape(this.p5.CLOSE);
    this.p5.pop();

    if (this.xPos <= 0 - this.p5.width / 6) {
      this.xSpeed = this.xSpeed * -1;
    }
    if (this.xPos >= 0 + this.p5.width / 6) {
      this.xSpeed = this.xSpeed * -1;
    }

    if (this.shouldAnimate) {
      if (this.yPos < -innerHeight / 2 + 100) {
        this.yPos += this.ySpeed;
      } else {
        this.xPos += this.xSpeed;
        this.powerUps.forEach((powerUp) => {
          powerUp.updatePosition(this.xPos, this.yPos);
          powerUp.activate();
        });
      }
    }

    return vertices;
  };

  retreat = () => {
    this.yPos -= this.ySpeed;
    this.xSpeed = 0;
    this.shouldAnimate = false;
    this.powerUps.forEach((pu) => {
      pu.shouldDie = true;
    });
  };
}

export class EvilPowerUp {
  p5: p5Type;
  xPosition: number;
  yPosition: number;
  shouldDraw = false;
  shouldAnimate = true;
  width = 20;
  ySpeed = getRandomNumber(-3, 3);
  xSpeed = getRandomNumber(0.5, 3);
  delay: number;
  shouldDie = false;
  opacity = 255;

  constructor(xPosition: number, yPosition: number, p5: p5Type, delay: number) {
    this.p5 = p5;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.delay = delay;
  }

  checkIfColliding = (x: number, y: number): boolean => {
    if (!this.shouldDraw || this.shouldDie) {
      return false;
    }
    const { left, right, top, bottom } = this.boundingBox;
    return x > left && x < right && y > top && y < bottom;
  };

  private get boundingBox() {
    const farLeftOfCircle = this.xPosition - this.width / 2;
    const farRightOfCircle = this.xPosition + this.width / 2;
    const topOfCircle = this.yPosition - this.width / 2;
    const bottomOfCircle = this.yPosition + this.width / 2;

    return {
      left: farLeftOfCircle,
      right: farRightOfCircle,
      top: topOfCircle,
      bottom: bottomOfCircle,
    };
  }

  activate() {
    this.delay -= 1;
    if (this.delay <= 0) {
      this.shouldDraw = true;
    }
  }

  updatePosition(x: number, y: number) {
    if (this.shouldDraw) {
      return;
    }
    this.xPosition = x;
    this.yPosition = y;
  }

  draw(): void {
    if (!this.shouldDraw) {
      return;
    }
    console.log(this.shouldDie);
    this.p5.push();
    this.p5.stroke(255, 255, 255, this.opacity);
    this.p5.fill(0, 0, 0, this.opacity);
    this.p5.circle(this.xPosition, this.yPosition, this.width);

    if (this.shouldAnimate) {
      this.yPosition += this.ySpeed;
      this.xPosition += this.xSpeed;
    }

    if (this.shouldDie) {
      this.opacity -= 10;
    }

    if (
      this.xPosition + this.width / 2 >= this.p5.width / 4 ||
      this.xPosition - this.width / 2 <= -this.p5.width / 4
    ) {
      this.xSpeed = this.xSpeed * -1;
    }

    if (this.yPosition - this.width / 2 <= -this.p5.height / 2) {
      this.ySpeed = this.ySpeed * -1;
    }

    if (this.yPosition - this.width > this.p5.height / 2) {
      this.shouldDraw = false;
    }
    this.p5.pop();
  }
}

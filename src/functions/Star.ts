import p5Type from 'p5';

export const STAR_WIDTH = 60;

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  maxSize: number;
  alpha: number;
}

export class Star {
  xVel: number;
  yVel: number;
  xPos: number;
  yPos: number;
  p5: p5Type | null = null;
  closeRadius = STAR_WIDTH / 4;
  farRadius = STAR_WIDTH / 2;
  npoints = 5;
  colour = 'white';
  speed = 0.5;
  private acceleration = 0.08;
  private friction = 0.92;
  private targetXVel = 0;
  private targetYVel = 0;
  private trail: TrailParticle[] = [];

  constructor(xPos: number, yPos: number, xVel: number, yVel: number) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = xVel;
    this.yVel = yVel;
  }

  updateSpikeLength(closeRadius: number): void {
    this.closeRadius = closeRadius;
  }

  updateSpikeCount(npoints: number): void {
    this.npoints = npoints;
  }

  bindToP5Instance(p5: p5Type): void {
    this.p5 = p5;
  }

  updateVelocity(newX: number, newY: number): void {
    this.targetXVel = newX;
    this.targetYVel = newY;
  }

  updatePosition(): void {
    this.xVel += (this.targetXVel - this.xVel) * this.acceleration;
    this.yVel += (this.targetYVel - this.yVel) * this.acceleration;

    if (this.targetXVel === 0) this.xVel *= this.friction;
    if (this.targetYVel === 0) this.yVel *= this.friction;

    if (Math.abs(this.xVel) < 0.1) this.xVel = 0;
    if (Math.abs(this.yVel) < 0.1) this.yVel = 0;

    this.xPos = this.xPos + this.xVel * this.speed;
    this.yPos = this.yPos + this.yVel * this.speed;
    this.constrain(this.farRadius);

    const moving = Math.abs(this.xVel) > 0.5 || Math.abs(this.yVel) > 0.5;
    if (moving) {
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      this.trail.push({
        x: this.xPos + offsetX,
        y: this.yPos + offsetY,
        size: 2,
        maxSize: 18 + Math.random() * 10,
        alpha: 150,
      });
      if (this.trail.length > 20) {
        this.trail.shift();
      }
    }
  }

  private drawTrail(p5: p5Type): void {
    p5.noStroke();
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const particle = this.trail[i];
      particle.size += (particle.maxSize - particle.size) * 0.15;
      particle.alpha -= 8;

      if (particle.alpha <= 0) {
        this.trail.splice(i, 1);
        continue;
      }

      const col = p5.color(this.colour);
      col.setAlpha(particle.alpha);
      p5.fill(col);
      p5.ellipse(particle.x, particle.y, particle.size, particle.size);
    }
  }

  updateSpeed(newSpeed: number): void {
    this.speed = newSpeed;
    setTimeout(() => {
      if (this.speed !== 0.5) {
        this.speed = 0.5;
      }
    }, 4000);
  }

  updateColour(newColour: string): void {
    this.colour = newColour;
  }

  get position() {
    return { x: this.xPos, y: this.yPos };
  }

  reset() {
    this.xPos = 0;
    this.yPos = -120;
  }

  private constrain(shapeWidth: number): void {
    if (!this.p5) {
      return;
    }
    const xDivisor = window.innerWidth >= 1024 ? 2 : 4;
    const minX = -this.p5.width / xDivisor + shapeWidth;
    const maxX = this.p5.width / xDivisor - shapeWidth;
    const minY = -this.p5.height / 2 + shapeWidth;
    const maxY = this.p5.height / 2 - shapeWidth;
    this.xPos = this.p5.constrain(this.xPos, minX, maxX);
    this.yPos = this.p5.constrain(this.yPos, minY, maxY);
  }

  draw = (
    p5: p5Type,
    shouldRotate: boolean
  ): {
    x: number;
    y: number;
  }[] => {
    this.drawTrail(p5);

    p5.push();
    if (shouldRotate) {
      p5.translate(this.xPos, this.yPos);
      p5.rotate(p5.frameCount / 50.0);
      p5.translate(-this.xPos, -this.yPos);
    }

    p5.fill(this.colour);
    const strokeCol = p5.color(this.colour);
    strokeCol.setAlpha(180);
    p5.stroke(p5.lerpColor(strokeCol, p5.color(0), 0.4));
    p5.strokeWeight(2);
    const x = this.xPos;
    const y = this.yPos;
    const radius1 = this.closeRadius;
    const radius2 = this.farRadius;
    const npoints = this.npoints;
    const TWO_PI = 2 * Math.PI;
    const angle = TWO_PI / npoints;
    const halfAngle = angle / 2.0;

    const vertices = [];
    p5.beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + p5.cos(a) * radius2;
      let sy = y + p5.sin(a) * radius2;
      vertices.push({ x: sx, y: sy });
      p5.vertex(sx, sy);
      sx = x + p5.cos(a + halfAngle) * radius1;
      sy = y + p5.sin(a + halfAngle) * radius1;
      vertices.push({ x: sx, y: sy });
      p5.vertex(sx, sy);
    }
    p5.endShape(p5.CLOSE);
    p5.pop();
    return vertices;
  };
}

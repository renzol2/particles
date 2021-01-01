class Particle {
  static generateRandomNumber(min, max) {
    return (max - min) * Math.random() + min;
  }

  constructor(x, y, radius) {
    this.pos = { x, y };
    this.vel = {
      x: Particle.generateRandomNumber(-5, 5),
      y: Particle.generateRandomNumber(-5, 5),
    };
    this.radius = radius;
  }

  updatePosition() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  reverseXVelocity() {
    this.vel.x = -this.vel.x;
  }

  reverseYVelocity() {
    this.vel.y = -this.vel.y;
  }
}

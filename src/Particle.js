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

  collidesWith(otherParticle) {
    const { pos, vel, radius } = otherParticle;
    const posDiffX = this.pos.x - pos.x;
    const posDiffY = this.pos.y - pos.y;
    const velDiffX = this.vel.x - vel.x;
    const velDiffY = this.vel.y - vel.y;

    const distance = Math.sqrt(posDiffX * posDiffX + posDiffY * posDiffY);
    // If they're not in range, not colliding
    if (distance > this.radius + radius) return false;
    
    // Check if particles are moving towards each other
    const dp = velDiffX * posDiffX + velDiffY * posDiffY;
    const movingTowards = dp < 0;
    return movingTowards;
  }
}

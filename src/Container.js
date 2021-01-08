class Container {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
  }

  addParticle(particle) {
    this.particles.push(particle);
  }

  checkWallCollision(particle) {
    if (!Boolean(particle)) return;

    const { pos, vel, radius } = particle;
    
    const hitLeftWall = pos.x <= radius && vel.x < 0;
    const hitRightWall = this.width - pos.x <= radius && vel.x > 0;
    const hitTopWall = pos.y <= radius && vel.y < 0;
    const hitBottomWall = this.height - pos.y <= radius && vel.y > 0;

    if (hitLeftWall || hitRightWall) {
      particle.reverseXVelocity();
    }
    if (hitTopWall || hitBottomWall) {
      particle.reverseYVelocity();
    }
  }

  updateParticles() {
    if (!Boolean(this.particles.length)) return;

    for (let i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i];
      if (particle === undefined) continue;

      this.checkWallCollision(particle);
      particle.updatePosition();
    }
  }

  clearParticles() {
    this.particles = [];
  }
}
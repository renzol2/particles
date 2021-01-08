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
    for (let i = 0; i < this.particles.length; i++) {
      let particle = this.particles[i];

      for (let j = i + 1; j < this.particles.length; j++) {
        let otherParticle = this.particles[j];
        if (particle.collidesWith(otherParticle)) console.log('bump !');
      }

      this.checkWallCollision(particle);
      particle.updatePosition();
    }
  }

  clearParticles() {
    this.particles = [];
  }
}

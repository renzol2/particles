/** @type {Container} */
let container;

function setup() {
  createCanvas(windowWidth, windowHeight);
  container = new Container();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0); // clear
  container.updateParticles();

  for (const p of container.particles) {
    // FIXME:? Drawing the radius 2x as big looks more accurate
    circle(p.pos.x, p.pos.y, p.radius * 2);
  }
}

function mouseClicked() {
  // Create particle at mouse location
  let p = new Particle(mouseX, mouseY, Particle.generateRandomNumber(5, 30));
  container.addParticle(p);
}

function keyPressed() {
  switch (keyCode) {
    case 67: // C
      container.clearParticles();
    default:
  }
}

/**
 * Stores and modifies particles
 */
class Container {
  constructor() {
    this.width = windowWidth;
    this.height = windowHeight;
    /** @type {Array<Particle>} */
    this.particles = [];
  }

  /**
   * Adds particle to container
   * @param {Particle} particle
   */
  addParticle(particle) {
    this.particles.push(particle);
  }

  /**
   * Performs particle-wall collision
   * @param {Particle} particle
   */
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
        // Change velocities when two particles collide
        if (particle.collidesWith(otherParticle)) {
          const newVel = particle.calculateCollision(otherParticle);
          const newOtherVel = otherParticle.calculateCollision(particle);
          particle.vel = newVel;
          otherParticle.vel = newOtherVel;
        }
      }

      this.checkWallCollision(particle);
      particle.updatePosition();
    }
  }

  clearParticles() {
    this.particles = [];
  }
}

/**
 * Represents a single particle in simulation
 */
class Particle {
  /**
   * Generates a random integer in [min, max]
   * @param {Number} min lower bound
   * @param {Number} max higher bound
   */
  static generateRandomNumber(min, max) {
    return (max - min) * Math.random() + min;
  }

  /**
   * Constructor for Particle
   * @param {Number} x x position coord of Particle
   * @param {Number} y y position coord of Particle
   * @param {Number} radius radius of Particle
   */
  constructor(x, y, radius) {
    this.pos = { x, y };
    this.vel = {
      x: Particle.generateRandomNumber(-5, 5),
      y: Particle.generateRandomNumber(-5, 5),
    };
    this.radius = radius;
  }

  /**
   * Updates particle's position based on its velocity
   */
  updatePosition() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  /**
   * Reverses Particle's horizontal velocity
   */
  reverseXVelocity() {
    this.vel.x = -this.vel.x;
  }

  /**
   * Reverses Particle's vertical velocity
   */
  reverseYVelocity() {
    this.vel.y = -this.vel.y;
  }

  /**
   * Returns whether this particle collides with the given particle
   * @param {Particle} otherParticle other particle
   */
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

  /**
   * Calculates new velocity of this particle if collided with other Particle
   * @param {Particle} otherParticle other particle
   */
  calculateCollision(otherParticle) {
    const { pos, vel } = otherParticle;
    const posDiffX = this.pos.x - pos.x;
    const posDiffY = this.pos.y - pos.y;
    const velDiffX = this.vel.x - vel.x;
    const velDiffY = this.vel.y - vel.y;

    // Dot product of < v_1 - v_2, x_1 - x_2 >
    const dp = posDiffX * velDiffX + posDiffY * velDiffY;
    const lengthPosDiff = Math.sqrt(posDiffX * posDiffX + posDiffY * posDiffY);
    const l = lengthPosDiff * lengthPosDiff;

    // TODO: incorporate mass

    const rhsScalar = dp / l;
    const rhs = { x: posDiffX * rhsScalar, y: posDiffY * rhsScalar };

    // Calculate new velocity
    const newVelocity = { x: this.vel.x - rhs.x, y: this.vel.y - rhs.y };
    return newVelocity;
  }
}

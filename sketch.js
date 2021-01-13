/** @type {Container} */
let container;
let isPaused = false;
let showControls = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  container = new Container();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(50); // clear

  if (!isPaused) {
    container.updateParticles();
  }

  for (const p of container.particles) {
    // FIXME:? Drawing the radius ~2x as big looks more accurate
    fill(p.color.r, p.color.g, p.color.b);
    circle(p.pos.x, p.pos.y, p.radius * 1.9);
  }
  
  if (showControls) writeControls();
}

function writeControls() {
  const controls = [
    'Click: create particle',
    'C: clear particles',
    'P: pause',
    'H: hide controls',
    'Up arrow: increase speed',
    'Down arrow: decrease speed',
    'R: reset speed',
  ];

  fill(255, 255, 255);
  text('Controls', 10, 20);
  controls.forEach((c, i) => {
    text(c, 20, 20 + (i + 1) * 20);
  });
}

function mouseClicked() {
  // Create particle at mouse location
  const size = getRandInt(5, 30);
  const color = {
    r: getRandInt(0, 255),
    g: getRandInt(0, 255),
    b: getRandInt(0, 255),
  };
  let p = new Particle(mouseX, mouseY, size, size);
  p.color = color;
  container.addParticle(p);
}

function keyPressed() {
  switch (keyCode) {
    case 67: // C
      container.clearParticles();
      break;
    case 82: // R
      container.timestep = 1;
      break;
    case 38: // up arrow
      container.adjustTimestep(1.2);
      break;
    case 40: // down arrow
      container.adjustTimestep(0.8);
      break;
    case 72: // H
      showControls = !showControls;
      break;
    case 80: // P
      isPaused = !isPaused;
      break;
    default:
  }
}

/**
 * Generates a random integer in [min, max]
 * @param {Number} min lower bound
 * @param {Number} max higher bound
 */
function getRandInt(min, max) {
  return (max - min) * Math.random() + min;
}

/**
 * Stores and modifies particles
 */
class Container {
  constructor() {
    this.width = windowWidth;
    this.height = windowHeight;
    this.timestep = 1;
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
      particle.updatePosition(this.timestep);
    }
  }

  adjustTimestep(factor) {
    this.timestep *= factor;
    if (this.timestep < 0) {
      this.timestep = 0;
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
   * Constructor for Particle
   * @param {Number} x x position coord of Particle
   * @param {Number} y y position coord of Particle
   * @param {Number} radius radius of Particle
   * @param {Number} mass mass of Particle
   * @param {Number} velocityRange determines range of random velocity [-vR, vR]
   */
  constructor(x, y, radius, mass, velocityRange = 40 / mass, color = null) {
    this.pos = { x, y };
    this.vel = {
      x: getRandInt(-velocityRange, velocityRange),
      y: getRandInt(-velocityRange, velocityRange),
    };
    this.radius = radius;
    this.mass = mass;
    this.color = color;
  }

  /**
   * Updates particle's position based on its velocity
   * @param {Number} timestep time component
   */
  updatePosition(timestep) {
    this.pos.x += this.vel.x * timestep;
    this.pos.y += this.vel.y * timestep;
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
    const { pos, vel, mass } = otherParticle;
    const posDiffX = this.pos.x - pos.x;
    const posDiffY = this.pos.y - pos.y;
    const velDiffX = this.vel.x - vel.x;
    const velDiffY = this.vel.y - vel.y;

    // Dot product of < v_1 - v_2, x_1 - x_2 >
    const dp = posDiffX * velDiffX + posDiffY * velDiffY;
    const lengthPosDiff = Math.sqrt(posDiffX * posDiffX + posDiffY * posDiffY);
    const l = lengthPosDiff * lengthPosDiff;

    const massTerm = (2 * mass) / (this.mass + mass);

    const rhsScalar = massTerm * (dp / l);
    const rhs = { x: posDiffX * rhsScalar, y: posDiffY * rhsScalar };

    // Calculate new velocity
    const newVelocity = { x: this.vel.x - rhs.x, y: this.vel.y - rhs.y };
    return newVelocity;
  }
}

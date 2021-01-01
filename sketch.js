function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let particles = [];
function draw() {
  background(0);  // clear

  for (const p of particles) {
    if ((p.pos.x - p.radius < 0 && p.vel.x < 0) || (p.vel.x > 0 && p.pos.x + p.radius > windowWidth)) {
      p.reverseXVelocity();
    }
    if ((p.pos.y - p.radius < 0 && p.vel.y < 0) || (p.vel.y > 0 && p.pos.y + p.radius > windowHeight)) {
      p.reverseYVelocity();
    }

    p.updatePosition();
    circle(p.pos.x, p.pos.y, p.radius);
  }
}

function mouseClicked() {
  // Create particle at mouse location
  particles.push(new Particle(mouseX, mouseY, Particle.generateRandomNumber(5, 20)));
}
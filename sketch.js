let container;

function setup() {
  createCanvas(windowWidth, windowHeight);
  container = new Container(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0); // clear
  container.updateParticles();

  for (const p of container.particles) {
    circle(p.pos.x, p.pos.y, p.radius);
  }
}

function mouseClicked() {
  // Create particle at mouse location
  container.addParticle(
    new Particle(mouseX, mouseY, Particle.generateRandomNumber(5, 20))
  );
}

function keyPressed() {
  switch (keyCode) {
    case 67:  // C
      container.clearParticles();
    default:
  }
}

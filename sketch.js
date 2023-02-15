let sketch = function(p){
// Set the canvas size
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

// Define the number of particles and the target position
let numParticles = 200;
let targetPos = p.createVector(canvasWidth/2, canvasHeight/2);

// Define the maximum velocity and the particle radius
let maxVelocity = 5;
let particleRadius = 10;

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function distance(a, b){
    // return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
    return (a.x - b.x + a.y - b.y);
}

// Define the particle class
class Particle {
  constructor() {
    this.position = p.createVector(randomNumber(0, canvasWidth), randomNumber(0, canvasHeight));
    this.velocity = p.createVector(randomNumber(-maxVelocity, maxVelocity), randomNumber(-maxVelocity, maxVelocity));
    this.personalBest = this.position.copy();
  }
  
  update(globalBest) {
    let r1 = Math.random();
    let r2 = Math.random();
    this.position.add(this.velocity);
    this.velocity.x = 0.9 * this.velocity.x + 1.2 * r1 * (this.personalBest.x - this.position.x) + 1 * r2 * (globalBest.x - this.position.x);
    this.velocity.y = 0.9 * this.velocity.y + 1.2 * r1 * (this.personalBest.y - this.position.y) + 1 * r2 * (globalBest.y - this.position.y);

    // Check if the particle is out of bounds
    if (this.position.x < 0 || this.position.x > canvasWidth) {
      this.velocity.x *= -1;
    }
    if (this.position.y < 0 || this.position.y > canvasHeight) {
      this.velocity.y *= -1;
    }
    
    // Update personal best
    if (this.position.dist(targetPos) < this.personalBest.dist(targetPos)) {
      this.personalBest = this.position.copy();
    }
  }
  
  draw() {
    console.log("p draw");
    console.log(this.position.x, this.position.y)
    let a = randomNumber(0, 255);
    let b = randomNumber(0, 255);
    let c = randomNumber(0, 255);
    p.fill(a, b, c);
    p.stroke(a, b, c);
    p.ellipse(this.position.x, this.position.y, particleRadius, 5);
  }
}

// Define the particle swarm class
class ParticleSwarm {
  constructor() {
    this.particles = [];
    for (let i = 0; i < numParticles; i++) {
      this.particles.push(new Particle());
    }
    this.globalBest = this.getBestParticle().personalBest.copy();
  }
  
  update() {
    let currGlobalBest = this.globalBest.copy();
    for (let particle of this.particles) {
      particle.update(currGlobalBest);
      if (particle.personalBest.dist(targetPos) < this.globalBest.dist(targetPos)) {
        this.globalBest = particle.personalBest.copy();
      }
    }
    console.log("gb")
    console.log(this.globalBest.x, this.globalBest.y)
  }
  
  draw() {
    console.log("swarm draw")
    p.fill(255);
    p.stroke(0);
    p.ellipse(targetPos.x, targetPos.y, particleRadius * 10);
    for (let particle of this.particles) {
      particle.draw();
    }
  }
  
  getBestParticle() {
    let bestParticle = this.particles[0];
    for (let particle of this.particles) {
      if (particle.personalBest.dist(targetPos) < bestParticle.personalBest.dist(targetPos)) {
        bestParticle = particle;
      }
    }
    return bestParticle;
  }
}

// Create the particle swarm
let particleSwarm;

// Set up the canvas and initialize
p.setup = function() {
    p.createCanvas(canvasWidth, canvasHeight);
    particleSwarm = new ParticleSwarm();
    p.frameRate(3);
}

p.draw = function() {
    p.background(255);
    particleSwarm.update();
    particleSwarm.draw();
}

p.mouseClicked = function(){
    targetPos.x = p.mouseX
    targetPos.y = p.mouseY;
}
}
let myp5 = new p5(sketch);
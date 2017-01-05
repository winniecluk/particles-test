// define Particle object type
// need to know where it is and where it's headed
// only want particle to live for a certain amount of time

window.particleSystem = window.particleSystem || {};

// pass angle in degrees and speed in pixels per second
particleSystem.Particle = function (posObj, life, angle, speed, color, keep) {
  // position of current particle
  this.position = {
    x: posObj.x,
    y: posObj.y
  };

  // life
  this.life = life;

  var angleInRadians = angle * Math.PI / 180;

  // speed horizontal, speed vertical * direction
  this.velocity = {
    x: speed * Math.cos(angleInRadians),
    // remember that according to canvas origin, +y moves downwards
    y: speed * Math.sin(angleInRadians)
  }

  // color of particle
  this.color = color;

  // should this particle be kept
  this.keep = keep;
}

// need to move the particle, create method
// dt is the change in time in seconds since we last updated
particleSystem.Particle.prototype.update = function(dt){
  this.life -= dt;

// remember, this is the code that modifies HOW a particle changes throughout its life

// keep moving if there's life
  if (this.life > 0){
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }
}

// stop particles in tracks
// particleSystem.Particle.prototype.stop = function(){

// }

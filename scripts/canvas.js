// get rid of keep later if I'm not going to use it

(function(){

// particle system
  this.particleSystem = this.particleSystem || {};

// execute code on next screen repaint
  this.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(cb) {
      // 60 fps is the typical user's screen refresh rate
      window.setTimeout(cb, 1000/60);
    };

  // hold the newly created particles
  var particles = [];
  var canvas;
  var context;
  var lastTimestamp;
  var count = 100;

  // determined upon creating the context of canvas; remember it needs to be an obj
  var startPosition;

  // particleSystem.Particle = function (posObj, life, angle, speed, color) {
  //   this.position = {
  //     x: posObj.x,
  //     y: posObj.y
  //   };
  //   this.life = life;
  //   var angleInRadians = angle * Math.PI / 180;
  //   this.velocity = {
  //     x: speed * Math.cos(angleInRadians);
  //     y: -speed * Math.sin(angleInRadians);
  //   }
  //   this.color = color;
  // }

  function coinFlip(){
    return Math.random() > 0.5 ? 1 : -1;
  }

  function createParticle(){
    // positionObj, life, angle (20 controls the variance), speed, color, keep
    // keep can be released into global later
    var keep = Math.random() > 0.5 ? true : false;
    particles.push(new particleSystem.Particle(startPosition, Math.random() + 2, 90 + Math.random() * 20 * coinFlip(), Math.random() * 100 + 20, 'blue', keep));
  }

  function stream(){
    // this releases a stream of 100
    // count can be released into global later
    // var count = 100;

    function releaseOne(){
      createParticle();
      count--;
      if (count > 0){
        setTimeout(releaseOne, 60);
      }
    } // close releaseOne
    releaseOne();
  }

// set context, draw the appearance of each particle
  function draw(){
    // set context
    context.fillStyle = 'white';
    // x, y, width, height
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);


// draw each one in the array
    particles.forEach(function(particle){
      if (particle.life > 0){
        context.fillStyle = particle.color;
        context.beginPath();
        // circle: x, y, radius, startAng, endAng, anticlockwise Bool
        context.arc(particle.position.x, particle.position.y + 16, 5, 0, Math.PI * 2);
        context.closePath();
        context.fill();
      } // closes if statement for particle life
    }) // closes particle loop

    // draw bigger and bigger blue rectangle inside glass
      for (var i = 30; i < particles.length; i++){
        context.fillStyle = 'blue';
        context.fillRect(startPosition.x - 60, startPosition.y + 210 - i, 120, -30 + i);
        // startPosition.y + 210 - i for -30 + i height
      }

    // if (particles.length > 30){
    //     context.fillStyle = 'blue';
    //     context.fillRect(startPosition.x - 60, startPosition.y + 165, 120, 14);
    // }

    // if (particles.length > 60){
    //   context.fillStyle = 'blue';
    //   context.fillRect(startPosition.x - 60, startPosition.y + 154, 120, 14);
    //   console.log(particles.length % 10);
    // }

  // draw the emitter
    context.fillStyle = 'gray';
    var size = 10;
    context.fillRect(startPosition.x - size / 2, startPosition.y - size / 2 + size, size, size);

    // draw glass
    context.strokeRect(startPosition.x - 60, startPosition.y + 40, 120, 140)

  } // closes draw function

// recursive -- keep calling that requestAnimationFrame
  function play(timestamp){
    var dt = timestamp - (lastTimestamp || timestamp);
    lastTimestamp = timestamp;

    dt /= 1000;

    // loop over array that stores newly created particles and tell it to update
    // this changes the position property of the particles in the array
    for (var i = 0; i < particles.length; i++){
      particles[i].update(dt);
    }

    // now we need to draw that updated particle
    draw();
    // let's do it all over again!
    window.requestAnimationFrame(play);
  }

  this.particleSystem.start = {
    init: function(){
      canvas = document.getElementById('canvas');
      context = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      startPosition = {
        x: canvas.width / 2,
        y: canvas.height * 1/3
      };

    var startButton = document.querySelector('#start');
    startButton.onclick = createParticle;

    var streamButton = document.querySelector('#stream');
    streamButton.addEventListener('click', stream, false);
    }, // this closes init

    updateCount: function(value){
      var churnBox = document.querySelector('#churnbox');
      churnBox.value = value;
      count = value;
    }, // this closes updateCount

    go: function(){
      play(new Date().getTime());
    }

  } // this closes particleSystem.start



})(); // this closes the IIFE

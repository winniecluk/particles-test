// get rid of keep later if I'm not going to use it

(function(){

// financial model variables
  var monthlySpendValue = 0;
  var cpmValue = 0;
  var totalWebVisits = 0;
  var monthlyActiveUsers = 0;
  var conversionRate = 0;

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
  var lossParticles = [];
  window.monthlyActiveArr = [];

  var canvas;
  var context;
  var lastTimestamp;
  var count = 0;
  var lossCount = 0;

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

  function updateMonthlyArr(){
    // if >, push
    // if <, pop

    function pushOne(){
      if (monthlyActiveArr.length < monthlyActiveUsers){
          monthlyActiveArr.push(1);
          setTimeout(pushOne, 60);
      } // close if
    } // close pushOne

    function popOne(){
      if (monthlyActiveArr.length > monthlyActiveUsers){
        monthlyActiveArr.pop();
        setTimeout(popOne, 60);
      }
    }

    pushOne();
    popOne();
  } // close fct


  function createLossParticle(){
    var keep = Math.random() > 0.5 ? true : false;
    lossParticles.push(new particleSystem.Particle(startPosition, Math.random() + 1, 90 + Math.random() * 60 * coinFlip(), Math.random() * 100 + 20, 'red', keep))
  }

  function stream(){

    function releaseOne(){
      if (count > 0){
        createParticle();
        count--;
        setTimeout(releaseOne, 60);
      }
    } // close releaseOne
    releaseOne();
  } // close stream

  function lossStream(){
    if (lossCount > 0){
      createLossParticle();
      lossCount--;
      setTimeout(lossStream, 60);
    }
  }

  function drawWater(){
    // particles = [];
    // setTimeout(function(){
      for (var i = 0; i < monthlyActiveArr.length; i++){
        context.fillStyle = 'blue';
        // startPosition.y + 180 - i: since it draws from startposition down, you have to slowly move the rectangle startposition down
        // var scalePercent = Math.floor(i / 8);
        context.fillRect(startPosition.x - 60, startPosition.y + 180 - i, 120, i);
        // startPosition.y + 210 - i for -30 + i height
        // console.log('drawWater working');
        // height needs to reflect current
        // maybe take snapshot of length here and then clear the particles array somewhere?
      }
    // }, 1000);
  } // this closes drawWater function

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

// draw particles in the lossParticles array
    lossParticles.forEach(function(lossParticle){
      if (lossParticle.life > 0){
        context.fillStyle = lossParticle.color;
        context.beginPath();
        // circle: x, y, radius, startAng, endAng, anticlockwise Bool
        context.arc(lossParticle.position.x, lossParticle.position.y + 180, 5, 0, Math.PI * 2);
        context.closePath();
        context.fill();
      }
    })


    // draw bigger and bigger blue rectangle inside glass
    drawWater();



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

  // draw the second emitter near the bottom
    context.fillStyle = 'rgba(255, 255, 255, 0)'
    context.fillRect(startPosition.x - size / 2, startPosition.y + 170, size, size);

    // startPosition = {
    //   x: canvas.width / 2,
    //   y: canvas.height * 1/3
    // };

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

    // update loss particles
    for (var i = 0; i < lossParticles.length; i++){
      lossParticles[i].update(dt);
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

    var monthlySpendBox = document.querySelector('#monthlySpendBox');

    var cpmBox = document.querySelector('#cpmBox');

    var webVisitsBox = document.querySelector('#webVisitsBox');

    var conversionBox = document.querySelector('#conversionBox');

    var monthlyActiveBox = document.querySelector('#monthlyActiveBox');

    var churnBox = document.querySelector('#churnbox');

    var userLossBox = document.querySelector('#userLossBox');

    }, // this closes init

    monthlySpend: function(value){
      // set box display
      monthlySpendBox.value = value;
      // set the value for other fcts
      monthlySpendValue = value;
      // equations to run every time
      totalWebVisits = monthlySpendValue * cpmValue;
      monthlyActiveUsers = Math.round(totalWebVisits * (conversionRate * 0.01));
      // set result box display
      webVisitsBox.value = totalWebVisits;
      monthlyActiveBox.value = monthlyActiveUsers;
      // set number of particles
      count = monthlyActiveUsers;
      stream();
      updateMonthlyArr();
    }, // this closes monthly spend

    cpm: function(value){
      cpmBox.value = value;
      cpmValue = value;

      totalWebVisits = monthlySpendValue * cpmValue;
      monthlyActiveUsers = Math.round(totalWebVisits * (conversionRate * 0.01));

      webVisitsBox.value = totalWebVisits;
      monthlyActiveBox.value = monthlyActiveUsers;

      count = monthlyActiveUsers;
      stream();
      updateMonthlyArr();
    }, // this closes cpm

    conversion: function(value){
      conversionRate = value;
      monthlyActiveUsers = Math.round(totalWebVisits * (value * 0.01));

      conversionBox.value = value;
      monthlyActiveBox.value = monthlyActiveUsers;

      count = monthlyActiveUsers;
      stream();
      updateMonthlyArr();
    },

    churn: function(value){
      // issue to be resolved later
      var churnBox = document.querySelector('#churnbox');
      churnBox.value = value;

      lossCount = (0.01 * value) * ((monthlySpendValue * cpmValue) * (conversionRate * 0.01));

      monthlyActiveUsers = ((monthlySpendValue * cpmValue) * (conversionRate * 0.01)) - ((0.01 * value) * ((monthlySpendValue * cpmValue) * (conversionRate * 0.01)));

      console.log('this is the new MAU ' + monthlyActiveUsers);

      monthlyActiveBox.value = monthlyActiveUsers;

      userLossBox.value = lossCount;

      lossStream();
      updateMonthlyArr();
    }, // this closes updateCount -- will not need later

    go: function(){
      play(new Date().getTime());
    }

  } // this closes particleSystem.start



})(); // this closes the IIFE

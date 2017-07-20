var ACCEL_G = -9.8, // m/s^2
    EASING = -15; // m/s^2

/**
 * Gladeye Jump ability.
 */
AFRAME.registerComponent('gladeye-jump-ability', {
  dependencies: ['velocity'],

  /* Schema
  ——————————————————————————————————————————————*/

  schema: {
    on: { default: 'keydown:Space gamepadbuttondown:0' },
    playerHeight: { default: 1.764 },
    maxJumps: { default: 1 },
    distance: { default: 5 },
    soundJump: { type: 'array', default: [] },
    soundLand: { type: 'array', default: [] },
    soundFalling: { type: 'array', default: [] },
    debug: { default: false }
  },

  init: function () {

    this.velocity = 0;
    this.numJumps = 0;

    this.landed = 0;
    this.falling = 0;

    var beginJump = this.beginJump.bind(this),
        events = this.data.on.split(' ');
    this.bindings = {};
    for (var i = 0; i <  events.length; i++) {
      this.bindings[events[i]] = beginJump;
      this.el.addEventListener(events[i], beginJump);
    }
    this.bindings.collide = this.onCollide.bind(this);
    this.el.addEventListener('collide', this.bindings.collide);
  },

  remove: function () {
    for (var event in this.bindings) {
      if (this.bindings.hasOwnProperty(event)) {
        this.el.removeEventListener(event, this.bindings[event]);
        delete this.bindings[event];
      }
    }
    this.el.removeEventListener('collide', this.bindings.collide);
    delete this.bindings.collide;
  },

  beginJump: function () {
    if (this.numJumps < this.data.maxJumps) {
      this.playJumpSound();
      var data = this.data,
          initialVelocity = Math.sqrt(-2 * data.distance * (ACCEL_G + EASING)),
          v = this.el.getAttribute('velocity');
      this.el.setAttribute('velocity', {x: v.x, y: initialVelocity, z: v.z});
      this.landed = 0;
      this.numJumps++;
    }
  },

  onCollide: function () {
    // TODO look into whether we can confirm the face we collided with is a top or side 
    this.numJumps = 0;
    this.stopFallingSound();
    this.playLandSound();
    // Grounded player
    this.landed = 1;
    this.falling = 0;
  },

  playJumpSound: function() {

    if(this.data.soundJump.length >= 1){

      var soundArray = this.data.soundJump;
      var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

      this.el.setAttribute('sound','src',soundArray[randomKey]);

      this.el.components.sound.playSound();
    }
  },

  playLandSound: function() {

    if(this.data.soundLand.length >= 1){
      var soundArray = this.data.soundLand;
      var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

      this.el.setAttribute('sound',
        {
          src: soundArray[randomKey],
          positional: false
        }
      );

      this.el.components.sound.playSound();
    }
  },

  playFallingSound: function() {

    if(this.data.soundFalling.length >= 1){
      var soundArray = this.data.soundFalling;
      var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

      this.el.setAttribute('sound',
        {
          src: soundArray[randomKey],
          positional: false
        }
      );

      this.el.components.sound.playSound();
    }
  },

  stopFallingSound: function() {
    if(this.data.soundFalling.length >= 1){
      this.el.components.sound.stopSound();
    }
  },

  tick: function(){

    if(this.landed == 0 && this.falling == 0 && this.el.body.velocity.y <= -16){
      this.falling = 1;
      this.playFallingSound();
    }

    this.previousVelocity = this.el.body.velocity.y;
  }

});
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
    soundJump: { default: '' },
    soundLand: { default: '' },
    debug: { default: false }
  },

  init: function () {
    console.log('init gladeye-jump-ability');
    this.velocity = 0;
    this.numJumps = 0;

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
      this.numJumps++;
    }
  },

  onCollide: function () {
    this.numJumps = 0;
  },

  playJumpSound: function(tipEl) {

    var soundArray = ['#jump0-sound','#jump1-sound'];
    var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

    this.el.setAttribute('sound','src',soundArray[randomKey]);

    this.el.components.sound.playSound();
  },

});
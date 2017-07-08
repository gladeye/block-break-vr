AFRAME.registerComponent('forward', {
  schema: {
    speed: {default: 0.1},
    directionEl: {type: 'string', required: true}
  },

  currentPosition: null,
  newPosition: null,

  init: function() {

    var directionEl = document.querySelector(this.data.directionEl);

  	var worldDirection = new THREE.Vector3();

    directionEl.object3D.getWorldDirection(worldDirection);
    worldDirection.multiplyScalar(-1);

    this.worldDirection = worldDirection;

    this.dynamicBodyComponent = this.el.components['dynamic-body'];

    if(this.dynamicBodyComponent){
      this.dynamicBodyComponent.body.applyImpulse(
          /* impulse */        new CANNON.Vec3(this.worldDirection.x,this.worldDirection.y,this.worldDirection.z),
          /* world position */ new CANNON.Vec3().copy(this.el.getComputedAttribute('position'))
      );
    }



  },

  tick: function() {

    if(!this.dynamicBodyComponent){
      this.currentPosition = this.el.getAttribute('position');
      this.newPosition = this.worldDirection
          .clone()
          .multiplyScalar(this.data.speed)
          .add(this.currentPosition);
      this.el.setAttribute('position', this.newPosition);
    }
  }
});
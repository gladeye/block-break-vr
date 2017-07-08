AFRAME.registerComponent('gun', {
  schema: {
    bulletTemplate: {default: '#bullet-template'},
    triggerKeyCode: {default: 32} // spacebar
  },

  init: function() {
    var that = this;
    document.body.onkeyup = function(e){
      if(e.keyCode == that.data.triggerKeyCode){
        that.shoot();
      }
    }
  },

  shoot: function() {
    this.createBullet();
  },

  createBullet: function() {

    var tip = document.querySelector('#player .gun-tip');

    //var el = this.el;
    var el = tip;
    var entity = document.createElement('a-entity');
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);

    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);
    //entity.setAttribute('mixin', this.data.mixin);
    entity.addEventListener('loaded', function () {
      entityRotation = entity.getComputedAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });
    entity.setAttribute('networked', 'template:' + this.data.bulletTemplate);
    entity.setAttribute('remove-in-seconds', 3);
    entity.setAttribute('forward', 'speed:0.3');
    el.sceneEl.appendChild(entity);


    //el.setAttribute('position', this.getInitialBulletPosition(tip));
    //el.setAttribute('rotation', this.getInitialBulletRotation(tip));

   // var scene = document.querySelector('a-scene');
    //scene.appendChild(el);
  },

  getInitialBulletPosition: function(spawnerEl) {
    var position = spawnerEl.getAttribute('position');

    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(spawnerEl.object3D.matrixWorld);

    return worldPos;
  },

  getInitialBulletRotation: function(spawnerEl) {
    var worldDirection = new THREE.Vector3();

    spawnerEl.object3D.getWorldDirection(worldDirection);
    worldDirection.multiplyScalar(-1);
    this.vec3RadToDeg(worldDirection);

    return worldDirection;
  },

  vec3RadToDeg: function(rad) {
    rad.set(THREE.Math.radToDeg(rad.x), THREE.Math.radToDeg(rad.y), THREE.Math.radToDeg(rad.z));
  }
});
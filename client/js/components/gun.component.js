AFRAME.registerComponent('gun', {
    schema: {
        bulletTemplate: {default: '#bullet-template'},
        triggerKeyCode: {default: 32} // spacebar
    },

    init: function () {
        var that = this;
        document.body.onkeyup = function (e) {
            if (e.keyCode == that.data.triggerKeyCode) {
                that.shoot();
            }
        }
    },

    shoot: function () {
        this.createBullet();
    },

    createBullet: function () {
        var tip = document.querySelector('#player .gun-tip');
        var sceneEl = tip.sceneEl;

        var entity = document.createElement('a-entity');
        entity.setAttribute('position', this.getInitialBulletPosition(tip));
        entity.setAttribute('rotation', tip.object3D.rotation);

        entity.setAttribute('networked', 'template:' + this.data.bulletTemplate);
        entity.setAttribute('remove-in-seconds', 3);
        //entity.setAttribute('dynamic-body', 'shape','sphere');
        //entity.setAttribute('dynamic-body', 'sphereRadius',0.1);
        entity.setAttribute('forward', 'speed', 0.3);
        entity.setAttribute('forward', 'directionEl', '#player .gun-tip');
        //entity.setAttribute('sphere-collider', 'objects', '#environment-collision1,.voxel');
        sceneEl.appendChild(entity);

        entity.addEventListener('hit', this.explode);
    },

    getInitialBulletPosition: function (spawnerEl) {
        var position = spawnerEl.getAttribute('position');

        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(spawnerEl.object3D.matrixWorld);

        return worldPos;
    },

    getInitialBulletRotation: function (spawnerEl) {
        var worldDirection = new THREE.Vector3();

        spawnerEl.object3D.getWorldDirection(worldDirection);
        worldDirection.multiplyScalar(-1);
        this.vec3RadToDeg(worldDirection);

        return worldDirection;
    },

    vec3RadToDeg: function (rad) {
        rad.set(THREE.Math.radToDeg(rad.x), THREE.Math.radToDeg(rad.y), THREE.Math.radToDeg(rad.z));
    },

    explode: function (event) {



        if(event.detail.el !== null){
            var elClass = event.detail.el.getAttribute('class');

            //console.log('hit event', event.detail.el);

            switch(elClass){
                case 'voxel':
                    //TODO: spawn explosion at world coordinates
                    console.log('Hit voxel');
                    break;
                case 'bullet-collider':
                    console.log('Hit bullet-collider');
                    break;
            }

        }
    }
});
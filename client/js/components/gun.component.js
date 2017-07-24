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

        this.playGunSound(tip);


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

        entity.addEventListener('hit', this.onBulletHit.bind(this));
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

    onBulletHit: function (event) {

        var hitEl = event.detail.el;
        var bulletEl = event.target;

        if(hitEl !== null){
            var elClass = hitEl.getAttribute('class');
            console.log('hitEl', hitEl);
            switch(elClass){
                case 'voxel':

                    this.destroyVoxel(hitEl,bulletEl);
                    break;
                case 'relic':
                    this.hitRelic(hitEl);
                    console.log('Hit relic');
                    break;
                case 'bullet-collider':
                    console.log('Hit bullet-collider');
                    break;
            }

            // destory the bullet
            this.destroyBullet(bulletEl);

        }
    },

    destroyBullet: function(bulletEl) {
        bulletEl.parentNode.removeChild(bulletEl);
    },

    hitRelic: function (hitEl) {
        console.log('hit relic:', hitEl);

        var relicHp = parseInt(hitEl.getAttribute('hp'));

        console.log('relic HP: ', relicHp);

        // Send out the relic hit event 
        this.el.emit('relic-hit');
    },

    destroyVoxel: function (hitEl,bulletEl) {
        console.log('HitEl: ',hitEl);

        console.log('ChildNodes: ',hitEl.parentNode.childNodes);

        //TODO: loop through voxels in scene and set their dynamic-body only if their z and x position match the deleted voxel

        //hitEl.setAttribute('sound','



        /*hitEl.addEventListener('sound-ended',function(){
            hitEl.parentNode.parentNode.removeChild(hitEl.parentNode);
        });*/

        this.explodeVoxel(hitEl);

        //setTimeout(function(){
            hitEl.parentNode.parentNode.removeChild(hitEl.parentNode);
        //},150);

        //TODO: spawn explosion at world coordinates then delete the bomb
        //TODO: add logic to explosion to remove collided entities
        console.log('Hit voxel');
    },

    playGunSound: function(tipEl) {

        var soundArray = ['#blip0-sound','#blip1-sound','#blip2-sound'];
        var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

        tipEl.setAttribute('sound','src',soundArray[randomKey]);

        tipEl.components.sound.playSound();
    },

    playExplodeSound: function(hitEl) {
        var soundArray = ['#explode0-sound','#explode1-sound','#explode2-sound','#explode3-sound'];
        var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

        hitEl.setAttribute('sound','src',soundArray[randomKey]);

        hitEl.components.sound.playSound();
    },

    explodeVoxel: function(hitEl) {

        this.playExplodeSound(hitEl);

        var explosionPoint = hitEl.object3D.getWorldPosition();
        var explosionFragmentsAmount = 11;

        var i=0;
        while( i <= explosionFragmentsAmount){

            var fragmentPositionRadomisers = {
                x: parseFloat((Math.random() * (0.1 - 0.5) + 0.5).toFixed(4)),
                y: parseFloat((Math.random() * (0.5 - 1) + 1).toFixed(4)),
                z: parseFloat((Math.random() * (0.1 - 0.5) + 0.5).toFixed(4))
            }

            // randomize positive/negative values for X/Z axes only 
            // so voxels on the ground level don't create fragments below the ground
            fragmentPositionRadomisers.x *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
            fragmentPositionRadomisers.z *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

            let fragmentPosition = {
                x: explosionPoint.x+fragmentPositionRadomisers.x, 
                y: explosionPoint.y+fragmentPositionRadomisers.y, 
                z: explosionPoint.z+fragmentPositionRadomisers.z
            };

            var fragment = document.createElement('a-entity');

            var fragmentColours = ['#CCC', '#666', '#444', '#888', '#111', '#222', '#333', '#777', '#AAA', '#632f02', '#40342a'];
            var randomColour = fragmentColours[Math.floor(Math.random() * fragmentColours.length)];

            fragment.setAttribute('class', 'voxelFragment'+i);
            fragment.setAttribute('position', fragmentPosition);
            fragment.setAttribute('geometry', { primitive: 'box', height: 0.075, width: 0.075, depth: 0.075 });
            fragment.setAttribute('remove-in-seconds', 3);
            fragment.setAttribute('material', {color: randomColour});

            hitEl.sceneEl.appendChild(fragment);

            fragment.setAttribute('dynamic-body', 'mass: 80');

            fragment.addEventListener('body-loaded', function(fragEvent){
                var frag = this;
                setTimeout(function () {
                    frag.body.applyImpulse(new CANNON.Vec3(Math.random()*2-1, 1, Math.random()*2-1), new CANNON.Vec3().copy(frag.object3D.getWorldPosition()));
                }, 0);
            });

            i++;
        }
        
    },

});
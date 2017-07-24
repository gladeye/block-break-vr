/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

// Define custom schema for syncing avatar color, set by random-color
var avatarSchema = {
    template: '#avatar-template',
    components: [
        'position',
        'rotation',
        {
            selector: '.head',
            component: 'material'
        }
    ]
};
var voxelSchema = {
    template: '#greystone-block-template',
    components: [
        'position',
        'rotation'
    ]
};
if(typeof NAF !== 'undefined'){
    NAF.options.compressSyncPackets = false;
    NAF.options.updateRate = 10;
    NAF.schemas.add(avatarSchema);
    NAF.schemas.add(voxelSchema);
}

// Called by Networked-Aframe when connected to server
function onConnect () {
    if(typeof NAF !== 'undefined'){
        NAF.entities.createAvatar('#avatar-template', '0 1.6 0', '0 0 0');
    }

}

/**
 * Main system
 */
AFRAME.registerSystem('main', {
    schema: { },  // System schema. Parses into `this.data`.

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function () {
        // Called on scene initialization.

        var physics = require('aframe-physics-system');
        physics.registerAll();

        var extras = require('aframe-extras');
        extras.registerAll();
        extras.primitives.registerAll();

        var sceneEl = document.querySelector('a-scene');

        if (sceneEl.hasLoaded) {
            this.initNetworking();
        } else {
            sceneEl.addEventListener('loaded', this.initNetworking.bind(this));
        }

    },

    initNetworking: function () {

        //do stuff here after scene initializes

        console.log('init networking');

        var self = this;

        var camera = document.querySelector('#camera');

        var sceneEl = document.querySelector('a-scene');

        var cursorEl = document.querySelector('#cursor');

        var envCollision = document.getElementById('environment-collision1');

        /*envCollision.addEventListener('collide', function (e) {

            var targetEl = e.detail.body.el;

            if(targetEl && targetEl.getAttribute('class') === 'voxel'){

                console.log('Voxel has collided with environment');

                setTimeout(function(){
                    targetEl.removeAttribute('dynamic-body');
                    targetEl.setAttribute('static-body','');
                    console.log('Removed dynamic body from voxel');
                },5000)


            }



            //e.detail.target.el;  // Original entity (playerEl).
            //e.detail.body.el;    // Other entity, which playerEl touched.
            //e.detail.contact;    // Stats about the collision (CANNON.ContactEquation).
            //e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
        });*/

        cursorEl.addEventListener('spawnEvent',function(e){

            this.playBlockSound();

            /*var voxelEl = e.detail.target.childNodes[0];

            console.log('Spawned voxel from network', voxelEl);

            if(voxelEl){
                //voxelEl.position = e.detail.pos;
                voxelEl.removeAttribute('dynamic-body', '');

                console.log('Setting pos: ',e.detail.pos);

                setTimeout(function(){
                    voxelEl.setAttribute('position', e.detail.pos.x+' '+e.detail.pos.y+' '+e.detail.pos.z);

                    setTimeout(function(){
                        voxelEl.setAttribute('dynamic-body', '');
                    },500);
                },500);
            }*/




        }.bind(this));

        this.optimizeMobile();

        this.spawnRelics(sceneEl);

        var playerEl = document.getElementById('player');
        playerEl.addEventListener('relic-hit', this.onRelicHit.bind(this));
    },

    playBlockSound: function(){
        var soundArray = ['#pop1-sound','#pop2-sound','#pop3-sound','#pop4-sound','#pop5-sound','#pop6-sound','#pop7-sound'];
        var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

        var blockSoundEmitter = document.querySelector('#block-sound-emitter');

        blockSoundEmitter.setAttribute('sound','src',soundArray[randomKey]);

        blockSoundEmitter.components.sound.playSound();
    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function (oldData) { },

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function () { },

    /**
     * Called on each scene tick.
     */
    tick: function (t) {




    },

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function () { },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function () { },

    onRelicHit: function(){ 
        console.log('fired from relic-hit event');

        this.gameOver();


    },

    gameOver: function () {


        //remove all voxels
        var voxelsInScene = document.querySelectorAll('.voxel');

        console.log('voxelsInScene', voxelsInScene);

        if(voxelsInScene.length >= 1){
            console.log('voxels are in the scene');
            for (var i = voxelsInScene.length - 1; i >= 0; i--) {
                console.log('voxelsInScene[i].parentNode', voxelsInScene[i].parentNode);
                voxelsInScene[i].parentNode.parentNode.removeChild(voxelsInScene[i].parentNode);
                //voxelsInScene[i].setAttribute('dynamic-body','');
            }
        }

        /*var environmentCollisionEl = document.getElementById('environment-collision1');

        var playerEl = document.getElementById('player');

        playerEl.removeAttribute('kinematic-body');
        environmentCollisionEl.removeAttribute('static-body');

        setTimeout(function(){
            environmentCollisionEl.setAttribute('dynamic-body');
        },500);*/




        //play game over music

        this.playGameOverMusic();



    },

    playGameOverMusic: function () {
        var bgMusicEl = document.getElementById('bg-music-emitter');

        bgMusicEl.setAttribute('sound','src','#game-over-music');
        bgMusicEl.setAttribute('sound','loop',false);

        bgMusicEl.addEventListener('sound-ended',this.playBuildMusic);

        bgMusicEl.components['sound'].play();
    },

    playBuildMusic: function () {
        var bgMusicEl = document.getElementById('bg-music-emitter');
        bgMusicEl.setAttribute('sound','src','#build-music');
        bgMusicEl.setAttribute('sound','loop',true);
        bgMusicEl.components['sound'].play();

        bgMusicEl.removeEventListener('sound-ended',this.playBuildMusic);
    },

    optimizeMobile: function () {
        // On mobile remove elements that are resource heavy
        var isMobile = AFRAME.utils.device.isMobile();
        var isPositionalTracking = AFRAME.utils.device.checkHasPositionalTracking();

        if (isMobile) {
            var particles = document.getElementById('particles');
            if(particles){
                particles.parentNode.removeChild(particles);
            }

            var cursor = document.getElementById('cursor');
            cursor.setAttribute('cursor','fuse',true);
            cursor.setAttribute('cursor','fuseTimeout',200);

        }

        if(!isPositionalTracking){
            var leftHand = document.getElementById('left-hand');
            if(leftHand !== null){
                leftHand.parentNode.removeChild(leftHand);
            }

            var rightHand = document.getElementById('right-hand');
            if(rightHand !== null){
                rightHand.parentNode.removeChild(rightHand);
            }

        }
    },

    spawnRelics: function(sceneEl) {

        var gameFloor = document.querySelector('#environment-collision1');

        var gameFloorWidth = parseInt(gameFloor.getAttribute('width'));
        var gameFloorDepth = parseInt(gameFloor.getAttribute('depth')); // unused for now

        var i = 0;
        while( i <= 1 ){

            /**
            *   WARNING: 
            *   Currently assumes the width/depth are equal (arena is square)
            */

            var randomSpot = Math.floor(Math.random()*(gameFloorWidth/2)) + 1; // this will get a number between 1 and (gameFloorWidth/2)
            randomSpot *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases

            // Spawn the relic on opposite sides of the arena, at a random point on the Z axis
            var relicPosition = '11 2 '+randomSpot;

            if( i == 1){
                relicPosition = '-11 2 '+randomSpot; // @TODO figure out a nicer way to handle X axis for these
                                                    // Think about how this can be factored into number of teams playing
            }

            var parentEntity = document.createElement('a-entity');
            parentEntity.setAttribute('position', relicPosition);

            var emptyEntity = document.createElement('a-entity');
            emptyEntity.setAttribute('class', 'relic');
            emptyEntity.setAttribute('material', 'transparent: true; opacity: 0;');
            emptyEntity.setAttribute('geometry', 'primitive: box; height: 1; width: 1; depth: 1');
            emptyEntity.setAttribute('static-body', '');

                        
            var entity = document.createElement('a-entity');
            entity.setAttribute('class', 'relic');
            entity.setAttribute('obj-model', 'obj: #crystal-block-obj; mtl: #crystal-block-mtl');
            entity.setAttribute('scale', '5 5 5');
            entity.setAttribute('shadow', 'receive: false');
            entity.setAttribute('static-body',  '');
            entity.setAttribute('snap','offset: 0.5 0.5 0.5; snap: 1 1 1');
            parentEntity.appendChild(entity);
            parentEntity.appendChild(emptyEntity);

            console.log('spawning relic: '+i+' at position '+ relicPosition);
            sceneEl.appendChild(parentEntity);

            i++;      
        }
    }
});
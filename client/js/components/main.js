/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

// Define custom schema for syncing avatar color, set by random-color
var headSchema = {
    template: '#head-template',
    components: [
        'position',
        'rotation',
        {
            selector: '.head',
            component: 'material'
        }
    ]
};
if(typeof NAF !== 'undefined'){
    NAF.options.compressSyncPackets = true;
    NAF.options.updateRate = 1;
    NAF.schemas.add(headSchema);
}

// Called by Networked-Aframe when connected to server
function onConnect () {
    console.log("onConnect");
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

        console.warn('Networked-Aframe development example. `npm run build` creates build.js');

        var sceneEl = document.querySelector('a-scene');

        if (sceneEl.hasLoaded) {
            this.initNetworking();
        } else {
            sceneEl.addEventListener('loaded', this.initNetworking.bind(this));
        }

    },

    initNetworking: function () {
        console.log('Initialized networking')



        //do stuff here after scene initializes

        var self = this;

        var camera = document.querySelector('#camera');

        var sceneEl = document.querySelector('a-scene');

        this.optimizeMobile();
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
    // tick: function (t) { },

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
    }
});
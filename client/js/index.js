var AFRAME = require('aframe');
require('networked-aframe');
//require('../../node_modules/three/examples/js/renderers/Projector');
//require('networked-aframe/server/static/js/gun.component');
require('networked-aframe/server/static/js/forward.component');
require('networked-aframe/server/static/js/remove-in-seconds.component');
require('networked-aframe/server/static/js/spawn-in-circle.component');
require('aframe-environment-component/index.js');
require('aframe-gradient-sky');
require('aframe-randomizer-components');
require('aframe-particle-system-component');
require('./components/intersection-spawn-multi');
require('./components/snap');
require('./components/gun.component')
require('./components/main');
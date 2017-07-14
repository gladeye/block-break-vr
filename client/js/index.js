var AFRAME = require('aframe');

global.jQuery = global.$ = require('jquery');
require('bootstrap');

require('networked-aframe');
require('networked-aframe/server/static/js/remove-in-seconds.component');
require('networked-aframe/server/static/js/spawn-in-circle.component');
require('aframe-environment-component/index.js');
require('aframe-gradient-sky');
require('aframe-randomizer-components');
require('aframe-particle-system-component');
require('aframe-preloader-component');

require('./components/auto-fall-respawn');
require('./components/intersection-spawn-multi');
require('./components/snap');
require('./components/forward.component')
require('./components/gun.component')
require('./components/main');
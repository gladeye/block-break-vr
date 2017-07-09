AFRAME.registerComponent('auto-fall-respawn', {
    schema: {
        height: {default: -50}
    },

    init: function() {

    },

    tick: function() {

        var position = this.el.object3D.position;

        if(position.y < this.data.height){
            this.el.setAttribute('position','0 20 0');
        }
    }
});
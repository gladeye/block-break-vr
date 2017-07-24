AFRAME.registerComponent('auto-fall-respawn', {
    schema: {
        fallHeight: {type: 'int', default: -50},
        respawnPosition: {type: 'vec3', default: {x: 0, y: 20, z: 0}}
    },

    originalPhysicsType: '',

    init: function() {

        var physicsType = this.getPhysicsType();

        if(physicsType !== 'none'){
            this.originalPhysicsType = this.el.getAttribute(physicsType);
        }
    },

    tick: function() {

        var position = this.el.object3D.position;

        //console.log(position.y,this.data.fallHeight);

        if(position.y < this.data.fallHeight){

            var physicsType = this.getPhysicsType();

            if(physicsType === 'dynamic-body'){
                this.el.removeAttribute(physicsType);
                setTimeout(function(){
                    this.el.setAttribute(physicsType,this.originalPhysicsType);
                }.bind(this),250);
            }

            this.el.setAttribute('position',this.data.respawnPosition);

            this.el.emit('respawned');
        }
    },

    getPhysicsType: function(){
        var physicsType = '';

        if(this.el.hasAttribute('kinematic-body')){
            physicsType = 'kinematic-body';
        }else if(this.el.hasAttribute('dynamic-body')){
            physicsType = 'dynamic-body';
        }else{
            physicsType = 'none';
        }

        return physicsType;
    }
});
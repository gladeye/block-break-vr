/**
 * Spawn entity at the intersection point on click, given the properties passed.
 *
 * `<a-entity intersection-spawn-multi="mixin: box; material.color: red">` will spawn
 * `<a-entity mixin="box" material="color: red">` at intersection point.
 */
AFRAME.registerComponent('intersection-spawn-multi', {
  dependencies: ['position'],
  schema: {
    templates: {
      type: 'array',
      required: true
    },
    currenttemplate: {
      type: 'string',
      required: true
    },
    event: {type: 'string', default: 'click'},
    offset: {type: 'vec3', default: {x: 0.25, y: 0.25, z: 0.25}},
    snap: {type: 'vec3', default: {x: 0.5, y: 0.5, z: 0.5}}
  },

  init: function () {
    const el = this.el;
    var self = this;

    const sceneEl = document.querySelector('a-scene');

    for(var i = 0; i < this.data.templates.length; i++){

      var templateSchema = {
        template: this.data.templates[i],
        components: [
          'position'
        ]
      };
      NAF.schemas.add(templateSchema);
    }

    el.addEventListener(this.data.event, function(evt){

      console.log('Click');

      var targetEl = evt.detail.intersectedEl;
      var targetElClass = targetEl.getAttribute('class');

      if(!targetElClass || targetElClass !== 'checkpoint'){
        var worldPos = evt.detail.intersection.point;
        const pos = AFRAME.utils.clone(worldPos);

        pos.x   = Math.floor(pos.x / self.data.snap.x) * self.data.snap.x + self.data.offset.x;
        pos.y = Math.floor(pos.y / self.data.snap.y) * self.data.snap.y+ self.data.offset.y;
        pos.z = Math.floor(pos.z / self.data.snap.z) * self.data.snap.z + self.data.offset.z;

        var spawnEl = document.createElement('a-entity');
        spawnEl.setAttribute('networked', 'template', self.data.currenttemplate);
        spawnEl.setAttribute('networked', 'showLocalTemplate', true);
        spawnEl.setAttribute('position', pos.x+' '+pos.y+' '+pos.z);
        sceneEl.appendChild(spawnEl);
      }
    });
  }
});

var Scene = function() {
	var self = this;
	var _def = $.Deferred();
	this.ready = _def.promise();
	
	this.init = function() {
		PhiloGL('canvas', {
			//context: { debug: true },
			onError: function(err) {
				App.error(err);
			},
			program: {
				from: 'uris',
				vs: 'glsl/vs.glsl',
				fs: 'glsl/fs.glsl'
			},
			onLoad: $.proxy(this.onLoad, this)
		});
	}
	
	this.onLoad = function(app) {
		var gl = this.gl = app.gl;
		this.program = app.program;
		this.canvas = app.canvas;
		this.camera = app.camera;
		this.scene = app.scene;

		gl.clearColor(0.0,0.0,0.0,0.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

		var lights = this.scene.config.lights;
		lights.enable = true;
		lights.ambient = { r:0.3, g:0.3, b:0.3 };
		lights.points = [{
			position: { x:-6, y:6, z:8 },
			color: { r:0.67, g:0.63, b:0.6 },
			specular: { r:1.0, g:1.0, b:1.0 }
		},{
			position: { x:-2, y:6, z:-8 },
			color: { r:0.4, g:0.4, b:0.4 },
			specular: { r:0.6, g:0.6, b:0.6 }
		},{
			position: {  x:6, y:-6, z:0 },
			color: { r:0.29, g:0.35, b:0.4 }
		}];
		
		this.camera.view.id();
		this.camera.view.$translate(0,0,-5);

		this.scene.render();
		
		_def.resolve();
	}
	
	this.setMug = function(newMug) {
		if(this.mug)
			this.scene.remove(this.mug);
		this.mug = newMug.model;
		this.scene.add(this.mug);
		this.draw();
	}
	
	this.draw = function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
		this.scene.render();
	}
	
	this.init();
}
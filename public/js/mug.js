function Mug() {
	var self = this;
	this._def = $.Deferred();
	this.ready = this._def.promise();
	
	$.get('obj/mug.obj', function(objData) {
		self.mesh = obj2js(objData);
		
		self.mesh.uniforms = {
			shininess: 32,
			matColor: [1.0, 1.0, 1.0]
		}
		self.model = new PhiloGL.O3D.Model(self.mesh);
		
		self.picker = $.farbtastic('#mug')
			.setColor('#ffffff')
			.linkTo(function() {
				if(!isNaN(this.rgb[0])) {
					self.model.uniforms.matColor = this.rgb;
					$('#imgContainer').css('background-color', this.color);
					App.scene.draw();
				}
			});
		
		self._def.resolve();
	});
	
	this.texFromUserImage = function() {
		var gl = App.scene.gl;
		if(self.texture)
			gl.deleteTexture(self.texture);
	
		self.texture = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, self.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, $('#imgTarget').get(0));
		
		// Either disallow mipmapping, set filters to linear (or nearest)
		// and clamp to edges or work around power-of-two limitation
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		//gl.generateMipmap(gl.TEXTURE_2D);
		
		App.scene.program.setUniform("hasTexture", true);
		App.scene.program.setUniform("sampler", 0);
		App.scene.program.setUniform("imageScale", 1.25);
		
		App.scene.draw();
	};
};
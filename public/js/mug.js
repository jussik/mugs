function Mug() {
	var self = this;
	var _def = $.Deferred();
	this.ready = _def.promise();
	
	this.showTexture = false;
	this.imageScale = 1.0;
	this.skipDraw = false;
	
	$('#imgTarget').load(function() {
		Util.fitImage($(this), 10);
		$('#imgLabel').hide();
		self.showTexture = true;
		self.texFromUserImage();
	});
	
	$('#imgClear').click(function() {
		$('#imgTarget').hide();
		$('#imgLabel').show();
		self.showTexture = false;
		self.texFromUserImage();
		return false;
	});
	$('#imgScale').bind('keyup change paste', function() {
		var fval = parseFloat($(this).val());
		if(!isNaN(fval) && fval >= 0.5 && fval <= 1.75) {
			self.imageScale = fval;
			App.scene.program.setUniform("imageScale", self.imageScale);
			if(!self.skipDraw)
				App.scene.draw();
		}
	})
	
	$.get('obj/mug.obj', function(objData) {
		self.mesh = obj2js(objData);
		
		self.mesh.uniforms = {
			shininess: 32,
			matColor: [1.0, 1.0, 1.0]
		}
		self.model = new PhiloGL.O3D.Model(self.mesh);
		
		self.picker = $.farbtastic('#picker')
			.setColor('#ffffff')
			.linkTo(function() {
				if(!isNaN(this.rgb[0])) {
					// set model material
					self.model.uniforms.matColor = this.rgb;
					// set image container background
					$('#imgContainer').css('background-color', this.color);
					if(this.rgb[0] + this.rgb[1] + this.rgb[2] < 1.5)
						$('#imgLabel').css('color', 'white');
					else
						$('#imgLabel').css('color', 'black');
					// render the mug with the new colour
					if(!self.skipDraw)
						App.scene.draw();
				}
			});
		
		_def.resolve();
	});
	
	this.texFromUserImage = function() {
		var gl = App.scene.gl;
		
		if(self.showTexture) {
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
			
			var img = $('#imgTarget');
			var ratio = img.width()/img.height();
			App.scene.program.setUniform("hasTexture", true);
			App.scene.program.setUniform("sampler", 0);
			App.scene.program.setUniform("imageScale", self.imageScale);
			App.scene.program.setUniform("imageRatio", ratio);
		} else {
			App.scene.program.setUniform("hasTexture", false);
		}
		
		if(!self.skipDraw)
			App.scene.draw();
	};
	
	this.load = function(data) {
		self.skipDraw = true;
		self.picker.setColor(data.color);
		$('#imgScale').val(data.scale).change();
		self.skipDraw = false;
		$('#imgTarget').hide().prop('src', data.img);
	}
};
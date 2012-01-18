function View() {
	var self = this;
	var c = $('#canvas');
	var moving = false;
	var start = {x:0, y:0, rot:0, pitch:0};
	var current = {x:0, y:0, rot:0, pitch:0};
	var zoom = 0;
	
	var update = function() {
		App.scene.camera.view.id();
		App.scene.camera.view.$translate(0,0,-5 + zoom);
		App.scene.camera.view.$rotateAxis(current.pitch,[1,0,0]);
		App.scene.camera.view.$rotateAxis(current.rot,[0,1,0]);
		App.scene.draw();
	};
	
	$('#canvas').mousedown(function(e) {
		current.x = start.x = e.clientX;
		current.x = start.y = e.clientY;
		moving = true;
		return false;
	});
	$('#canvas').bind('mousewheel', function(e, delta) {
		zoom += delta/5;
		zoom = Math.max(Math.min(zoom,2),-2);
		update();
		return false;
	});
	$(document).mousemove(function(e) {
		if(moving) {
			current.x = e.clientX;
			current.y = e.clientY;
			current.rot = start.rot + (current.x/100 - start.x/100);
			current.pitch = start.pitch + (current.y/100 - start.y/100);
			current.pitch = Math.max(Math.min(current.pitch,1),-1);
			update();
			return false;
		}
	});
	$(document).mouseup(function(e) {
		start.rot = current.rot;
		start.pitch = current.pitch;
		moving = false;
	})
}
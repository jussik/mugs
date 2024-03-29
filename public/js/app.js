var App = {
	init: function() {
		App.scene = new Scene();
		App.currentMug = new Mug();
		App.uploads = new UploadHandler();
		
		$.when(App.scene.ready, App.currentMug.ready).done(function() {
			App.view = new View();
			App.scene.setMug(App.currentMug);
			GetPopularMugs();
		}).fail(App.error);
	},
	error: function(msg) {
		console.error(msg);
	},
	message: function(msg) {
		console.info(msg);
	}
};

$(function() {
	App.init();
});
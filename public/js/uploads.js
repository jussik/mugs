function UploadHandler() {
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", function(e) {
		App.message("Uploaded " + ((e.loaded/e.total) * 100).toFixed(2) + "%");
	});
	xhr.upload.addEventListener("load", function(e) {
		App.message("Upload complete");
	});
	xhr.upload.addEventListener("abort", function(e) {
		App.message("Upload aborted");
	});
		
	$('#imgUpload').change(function(ev) {
		var file = ev.target.files[0];
		if(file.type != 'image/png' &&
			file.type != 'image/jpeg' &&
			file.type != 'image/gif') {
			App.message('File is not in a valid image format!');
			return;
		}
		
		var reader = new FileReader();
		reader.onload = function(re) {
			$('#imgTarget')
				.prop('src', re.target.result)
				.unbind('load.applyTex')
				.bind('load.applyTex', function() {
					App.currentMug.texFromUserImage();
				});
			$('#imgLabel').hide();
		};
		reader.readAsDataURL(file);
		
		xhr.open("POST", "upload");
		var dat = new FormData();
		dat.append('file', file);
		xhr.send(dat);
	});
	$('#imgUpload').click(function(ev) {
		ev.stopPropagation();
	});
	$('#imgContainer').click(function() {
		$('#imgUpload').trigger('click');
	});
	$('#imgTarget').load(function() {
		var img = $(this);
		var pw = img.parent().width();
		var ph = img.parent().height();
		var iw = Math.min(img.width(),pw-10);
		var ih = Math.min(img.height(),ph-10);
		img.css({
			width:iw,
			height:ih,
			marginLeft:(pw-iw)/2,
			marginTop:(ph-ih)/2
		});
	});
}
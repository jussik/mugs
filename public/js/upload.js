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
			$('#imgTarget').prop('src', re.target.result);
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
		Util.fitImage($(this), 10);
	});
}
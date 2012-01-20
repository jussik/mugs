function UploadHandler() {
	var handleFile = function (file) {
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
	};

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
		handleFile(ev.target.files[0]);
	});
	$('#imgUpload').click(function(ev) {
		ev.stopPropagation();
	});
	$('#imgContainer').click(function() {
		$('#imgUpload').trigger('click');
	});
	
	targetElem = $('#imgContainer').get(0);
	targetElem.addEventListener('dragover', function(ev) {
		ev.stopPropagation();
		ev.preventDefault();
		ev.dataTransfer.dropEffect = 'copy';
	}, false);
	targetElem.addEventListener('drop', function(ev) {
		ev.stopPropagation();
		ev.preventDefault();
		handleFile(ev.dataTransfer.files[0]);
	}, false);
}
function UploadHandler() {
	$('#imgUpload').change(function(ev) {
		var file = ev.target.files[0];
		if(!file.type.match('image.*')) {
			App.message('Upload not a valid image file');
			return;
		}
		
		var reader = new FileReader();
		reader.onload = function(re) {
			$('#imgTarget').prop('src', re.target.result).css({width:'auto',height:'auto'});
			$('#imgLabel').hide();
			App.currentMug.texFromUserImage();
		};
		reader.readAsDataURL(file);
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
	})
}
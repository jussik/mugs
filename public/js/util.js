Util = {
	fitImage: function(img, margin) {
		var pw = img.parent().width();
		var ph = img.parent().height();
		var iw = Math.min(img.width(),pw - margin);
		var ih = Math.min(img.height(),ph - margin);
		img.css({
			width:iw,
			height:ih,
			marginLeft:(pw-iw)/2,
			marginTop:(ph-ih)/2
		});
		img.show();
	}
}
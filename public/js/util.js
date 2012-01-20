Util = {
	fitImage: function(img, margin) {
		img.show().css({
			width: 'auto',
			height: 'auto',
			marginLeft: '0px',
			marginTop: '0px'
		});
		
		var iw = img.width();
		var ih = img.height();
		var ratio = iw / ih;
		var pw = img.parent().width();
		var ph = img.parent().height();
		iw = Math.min(iw, pw - margin);
		ih = Math.min(ih, ph - margin);
		
		if(ratio > (iw/ih)) {
			ih = iw / ratio;
		} else {
			iw = ih * ratio;
		}
		
		img.css({
			width: iw,
			height: ih,
			marginLeft: (pw - iw) / 2,
			marginTop: (ph - ih) / 2
		});
	}
}
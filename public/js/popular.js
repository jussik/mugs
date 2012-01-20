function GetPopularMugs() {
	$.getJSON('/popular', function(list) {
		for(var i=0;i<list.length;i++) {
			var mug = list[i];
			var elem = $('#popularTemplate').clone()
				.css('background-color', mug.color)
				.click($.proxy(function () {
					App.currentMug.load(this);
				}, mug));
			if(mug.img) {
				elem.children().prop('src', mug.img)
					.load(function() {
						Util.fitImage($(this), 5);
					});
			} else {
				elem.children().remove();
			}
			elem.appendTo('#popular').show();
		}
	});
}
function GetPopularMugs() {
    var addMug = function(mug) {
        var elem = $('#popularTemplate').clone()
            .css('background-color', mug.color)
            .click(function () {
                App.currentMug.load(mug);
            });
        elem.children('.popularRemove').click(function(ev) {
            $(this).parent().remove();
            ev.stopPropagation();
            $.ajax('/popular', {
                type: "DELETE",
                data: JSON.stringify(mug),
                contentType: 'application/json'
            });
            return false;
        });
        if(mug.img) {
            elem.children('img').prop('src', mug.img)
                .load(function() {
                    Util.fitImage($(this), 5);
                });
        } else {
            elem.children('img').remove();
        }
        elem.appendTo('#popular').show();
    };

	$.getJSON('/popular', function(list) {
		for(var i=0;i<list.length;i++) {
			addMug(list[i]);
		}
	});
    
    $('#addPopular').click(function() {
        // save if no image or image has been saved
        if(!App.currentMug.showTexture || $('#imgTarget').data('storedFile')) {
            var data = { color: App.currentMug.color };
            if($('#imgTarget').data('storedFile')) {
                var img = $('#imgTarget').prop('src');
                data.img = img.substr(img.lastIndexOf('/') + 1);
                data.scale = App.currentMug.imageScale;
            }
            $.ajax('/popular', {
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(mug) {
                    addMug(mug);
                }
            });
        } else {
            console.error('Cannot save mug, image not in storage');
        }
        return false;
    });
    
}
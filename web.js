var common = require('./common'),
	express = require('express'),
	form = require('connect-form'),
	app = express.createServer(
		form({ keepExtensions: true, uploadDir: common.tempUploadDir })
	),
	upload = require('./upload');

app.use(express.static(common.publicDir));
app.post('/upload', upload.onUpload);

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Listening on ' + port);
});

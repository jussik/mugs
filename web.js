var common = require('./common'),
	express = require('express'),
	form = require('connect-form'),
	app = express.createServer(
		form({ keepExtensions: true, uploadDir: common.tempUploadDir })
	);

app.use(express.static(common.publicDir));
app.post('/upload', require('./upload').post);
app.get('/popular', require('./popular').get);

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Listening on ' + port);
});

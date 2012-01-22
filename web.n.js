var common = require('./common.n'),
	express = require('express'),
	app = express.createServer(),
    upload = require('./upload.n'),
    popular = require('./popular.n');

app.use(express.static(common.publicDir));
app.use(express.bodyParser({ uploadDir: common.tempUploadDir, keepExtensions: true }));

app.post('/upload', upload.post);
app.get('/popular', popular.get);
app.post('/popular', popular.post);
app.delete('/popular', popular.delete);

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log('Listening on ' + port);
});

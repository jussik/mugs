var express = require('express'),
	app = express.createServer();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index.jade', { layout: false });
});

var port = process.env.PORT || 3000;
app.listen(port);

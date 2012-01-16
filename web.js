var express = require('express'),
	app = express.createServer();

app.use(express.static(__dirname + '/public'));
app.register(".jade", require("jade").express);
app.set("view engine", "jade");
app.set('view options', { layout: false });

app.get('/', function(req, res) {
	res.render('index.jade');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Listening on ' + port);
});

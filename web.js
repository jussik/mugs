var express = require('express'),
	app = express.createServer();

app.use(express.static(__dirname + '/public'));
app.set("view engine", "jade");
app.register(".jade", require("jade").express);

app.get('/', function(req, res) {
	res.render('index', { layout: false });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Listening on ' + port);
});

var common = require('./common'),
	mongo = require('mongoskin');

exports.get = function(req, res) {
	mongo.db('localhost:27017/mugs').collection('mugs').find().toArray(function(err, items) {
		if(err) {
			console.log(err);
			res.json(err);
		} else {
			for(var i=0;i<items.length;i++) {
				var item = items[i];
				item.img = common.publicUploadURL + '/' + item._id.substr(0,3) + '/' + item._id;
				delete item._id;
			}
			res.json(items);
		}
	});
}

exports.post = function(req, res) {
	res.send(req.body.bar);
	/*db('localhost:27017/mugs').collection('mugs').find().toArray(function(err, items) {
		console.dir(items);
	});*/
}
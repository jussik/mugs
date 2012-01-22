var common = require('./common.n');

var mongo = (new (require('mongolian')));
mongo.log.debug = function() {};
var db = mongo.db('mugs');

function dbToResponse(mug) {
    delete mug._id;
    if(mug.img)
        mug.img = common.getImgURL(mug.img);
    return mug;
}

exports.get = function(req, res) {
	db.collection('mugs').find()
        .map(dbToResponse)
        .toArray(function(err, items) {
            if(err) {
                console.log(err);
                res.json(err);
            } else {
                res.json(items);
            }
        });
}

exports.post = function(req, res) {
	var mug = req.body;
    // store only the filename of the image URL
    if(mug.img)
        mug.img = mug.img.substr(mug.img.lastIndexOf('/') + 1);
	db.collection('mugs').save(mug);
    res.json(dbToResponse(mug));
}

exports.delete = function(req, res) {
    var mug = req.body;
    if(mug.img === undefined)
        mug.img = null;
    if(mug.scale === undefined)
        mug.scale = null;
    db.collection('mugs').remove({
        color: mug.color,
        img: mug.img.substr(mug.img.lastIndexOf('/') + 1),
        scale: mug.scale
    });
    res.send(204);
}
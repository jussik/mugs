var common = require('./common.n');

var mongo = require('mongolian')
var db = (new mongo).db('mugs');

function dbToResponse(mug) {
    delete mug._id;
    if(mug.img)
        mug.img = '/' + common.publicUploadURL + '/' + mug.img.substr(0,3) + '/' + mug.img;
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
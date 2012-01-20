var common = require('./common');

exports.get = function(req, res) {
	var img1 = "2e4/2e4ed85a249e0d819df884d55176c16c.png";
	var img2 = "17f/17f155fd946041726be3eae39a0050ea.png";
	res.json([{
		color: '#ffffff',
		img: '/' + common.publicUploadURL + '/' + img1,
		imgScale: 1.5
	},{
		color: '#ffffff',
		img: '/' + common.publicUploadURL + '/' + img2,
		imgScale: 1.25
	},{
		color: '#ffe133',
		img: '/' + common.publicUploadURL + '/' + img1,
		imgScale: 0.9
	}]);
}
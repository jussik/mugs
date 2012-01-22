var path = require('path');

exports.publicDir = path.join(__dirname, 'public');
exports.tempUploadDir = path.join(__dirname, 'tmptex');
exports.publicUploadURL = 'pubtex';
exports.publicUploadDir = path.join(exports.publicDir, exports.publicUploadURL);

exports.getImgURL = function(img) {
    return '/' + exports.publicUploadURL + '/' + img.substr(0,2) + '/' + img;
}
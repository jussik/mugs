var path = require('path');

exports.publicDir = path.join(__dirname, 'public');
exports.tempUploadDir = path.join(__dirname, 'tmptex');
exports.publicUploadURL = 'pubtex';
exports.publicUploadDir = path.join(exports.publicDir, exports.publicUploadURL);
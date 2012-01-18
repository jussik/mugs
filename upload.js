/*
 * This file is responsible for receiving uploaded files and
 * storing them intelligently.
 *
 * 1. uploaded file is stored in a temporary location
 * 2. md5sum of file is calculated
 * 3. construct a new location for the file: {publicUploadDir}/{md5prefix}/{md5}.{ext}
 *  - publicUploadDir is the configured location for uploads
 *  - md5prefix is the first 3 characters of the file's md5
 *  - md5 is the md5sum itself
 *  - ext is the extension of the file
 * 4. if file doesn't exist, move it there and stop
 * 5. if file exists and is the same file as the one being uploaded,
 *    remove the temporary file and stop
 * 6. repeat steps 3-6 by adding an incrementing suffix ("_1", "_2", ...) to the end
 *    of the md5sum in the filename until a slot is found or the try threshold is reached
 */

var common = require('./common'),
	form = require('connect-form'),
	fs = require('fs'),
	path = require('path'),
	crypto = require('crypto');
	
require('buffertools');

function md5sum(stream, callback) {
	var md5 = crypto.createHash('md5');
	
	stream.on('data', function (data) {
		md5.update(data);
	});
	stream.on('error', function (err) {
		callback(null, err);
	});
 	stream.on('end', function(){
 		callback(md5.digest('hex'));
 	});
}

function isSameFile(path1, path2) {
	var fd1 = fs.openSync(path1, 'r');
	var fd2 = fs.openSync(path2, 'r');
	var size1 = fs.fstatSync(fd1).size;
	var size2 = fs.fstatSync(fd2).size;
	
	if(size1 != size2) {
		fs.closeSync(fd1);
		fs.closeSync(fd2);
		return false;
	}
	
	var buf1 = new Buffer(size1);
	var buf2 = new Buffer(size2);
	// Files should be small enough that we don't need to use async read
	var read1 = fs.readSync(fd1, buf1, 0, size1, 0);
	var read2 = fs.readSync(fd2, buf2, 0, size2, 0);
	fs.closeSync(fd1);
	fs.closeSync(fd2);

	return buf1.equals(buf2);
}

exports.onUpload = function(req, res) {
	req.form.complete(function(err, fields, files) {
		if(err) {
			res.send(err);
		} else {
			var tmpPath = files.file.path;
			var stream = fs.ReadStream(tmpPath);
			md5sum(stream, function(checksum, error) {
				if(checksum) {
					// publicUploadDir is split into directories made from the first 3
					// characters of the file's md5sum.
					var dir = path.join(common.publicUploadDir, checksum.substr(0,3));
					// Filename is the file's md5sum with extension.
					var name = checksum;
					var ext = path.extname(tmpPath);
					var newPath = path.join(dir, name + ext);
					var requireMove = true;
					
					// If we get a collision, we do a bitwise compare to see if they're
					// the same file. If different, add a suffix to the new file.
					if(path.existsSync(newPath)) {
						if(isSameFile(tmpPath, newPath)) {
							// Don't need to move the file as they're the same
							requireMove = false;
						} else {
							var inc = 1;
							var done = false;
							while(!done) {
								var newPath = path.join(dir, name + "_" + inc + ext);
								if(path.existsSync(newPath)) {
									if(isSameFile(tmpPath, newPath)) {
										// Found the same file, no move necessary
										requireMove = false;
										done = true;
									}
									
									if(inc > 10) {
										console.log('Hit 10 filename collisions!');
										res.send('Unable to save file');
										requireMove = false;
										done = true;
									}
									inc++;
								} else {
									// Path doesn't exist, let's move
									done = true;
								}
							}
						}
					}
					if(requireMove) {
						// Move the file, they should be in the same partition
						var newPathDir = path.dirname(newPath);
						if(!path.existsSync(newPathDir))
							fs.mkdirSync(newPathDir);
						fs.renameSync(tmpPath, newPath);
					} else {
						// Remove temporary file
						fs.unlinkSync(tmpPath);
					}
					res.send(newPath);
				} else {
					res.send(error);
				}
			});
		}
	});
};
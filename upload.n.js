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

var common = require('./common.n'),
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

function pathCheck(data) {
    if(path.existsSync(data.newPath)) {
        if(isSameFile(data.oldPath, data.newPath)) {
            // Found the same file, no move necessary
            data.alreadyExists = true;
            return true;
        }
    } else {
        // Path doesn't exist, let's write
        data.alreadyExists = false;
        return true;
    }
    return false;
}

function fileLengthCheck(data) {
    for(var len=3;len<=data.fullname.length;len++) {
        data.newPath = path.join(data.dir, data.fullname.substr(0, len));
        if(pathCheck(data))
            return true;
    }
    return false;
}

function fileSuffixCheck(data) {
    // Append an incrementing hex digit to the filename
    for(var suf=0;suf<16;suf++) {
        data.newPath = path.join(data.dir, data.fullname + suf.toString(16));
        if(pathCheck(data))
            return true;
    }
    // Implausibly many collisions
    console.log('Hit too many filename collisions!');
    return false;
}

exports.post = function(req, res) {
    var oldPath = req.files.file.path;
    var stream = fs.ReadStream(oldPath);
    md5sum(stream, function(checksum, error) {
        if(checksum) {
            var data = {
                oldPath: oldPath,
                newPath: null,
                // publicUploadDir is split into directories made from the first 3
                // characters of the file's md5sum.
                dir: path.join(common.publicUploadDir, checksum.substr(0,3)),
                // Filename is the file's md5sum.
                fullname: checksum,
                alreadyExists: false
            };
            
            // perform filename eligibility checks
            var success = fileLengthCheck(data) || fileSuffixCheck(data);
            
            if(success) {
                if(data.alreadyExists) {
                    // Remove temporary file if the required file already exists
                    fs.unlinkSync(data.oldPath);
                } else {
                    // Move the file, they should be in the same partition
                    var newPathDir = path.dirname(data.newPath);
                    if(!path.existsSync(newPathDir))
                        fs.mkdirSync(newPathDir);
                    fs.renameSync(data.oldPath, data.newPath);
                }
                // return URL of image
                var url = path.basename(data.newPath);
                url = '/' + common.publicUploadURL + '/' + url.substr(0,3) + '/' + url;
                res.json({img:url});
            } else {
                // No eligible names
                console.log('no eligilble filenames in file upload: ', data.oldPath);
                res.json({error:'Could not upload data'}, 400);
                // Remove temporary file
                fs.unlinkSync(data.oldPath);
            }
        } else {
            console.log('checksum error in file upload: ', error);
            res.json({error:'Could not upload data'}, 400);
        }
    });
};
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
    // Start with the first 2 characters of the hash and
    // keep adding to the length until we find the same file
    // or an unused filename
    for(var len=2;len<=data.fullname.length;len++) {
        data.newPath = path.join(data.dir, data.fullname.substr(0, len) + data.ext);
        if(pathCheck(data))
            return true;
    }
    return false;
}

function fileSuffixCheck(data) {
    // Append an incrementing hex digit to the filename
    for(var suf=0;suf<16;suf++) {
        data.newPath = path.join(data.dir, data.fullname + suf.toString(16) + data.ext);
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
                ext: path.extname(oldPath),
                // publicUploadDir is split into directories made from the first 2
                // characters of the file's md5sum.
                dir: path.join(common.publicUploadDir, checksum.substr(0,2)),
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
                url = common.getImgURL(url);
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
/*
 * Wavefront OBJ to Javascript
 * Works for Blender .obj export, may require tweaking for others
 * Only supports elements 'v', 'vt', 'vn' and 'f'
 * Triangulates quads and reorders the data to use a shared index array
 *
 * Jussi Kosunen - 2012
 */

function obj2js(text) {
	function copyVert(oldArr, oldIdx, newArr, newIdx) {
		for(var i=0;i<3;i++)
			newArr[newIdx*3+i] = oldArr[oldIdx*3+i];
	};

	// Fill vector arrays
	var oldVecs = { v:[], vn:[], vt:[] };
	
	var lines = text.split('\n');
	for(var i=0;i<lines.length;i++) {
		if(lines[i][0] == 'v') {
			var toks = lines[i].split(' ');
			var arr = oldVecs[toks[0]];
			arr.push(parseFloat(toks[1]));
			arr.push(parseFloat(toks[2]));
			arr.push(parseFloat(toks[3]));
		}
	}
	
	// Index faces and fill new arrays
	var indexCounter = 0;
	var vertices = {}; // map from e.g. "123/432/345" to new index
	var output = { indices:[], vertices:[], texCoords:[], normals:[] };
	
	for(var i=0;i<lines.length;i++) {
		var line = lines[i];
		if(line[0] != 'f') continue;
		
		var toks = line.split(' ').slice(1);
		if(toks.length > 3) {
			// Triangulate by turning 4 vertices of a face into 6
			toks[4] = toks[3];
			toks[3] = toks[0];
			toks[5] = toks[2];
		}
		for(var vi=0;vi<toks.length;vi++) {
			// vertKey contains e.g. "123/432/345"
			var vertKey = toks[vi];
			var vertIndex = vertices[vertKey];
			if(vertIndex == null) {
				// Splitting vertKey into v, vt and vn indices
				var vtoks = vertKey.split('/');
				// Subtract 1 as obj counts indices from 1
				copyVert(oldVecs.v, parseInt(vtoks[0])-1, output.vertices, indexCounter);
				if(vtoks.length > 1 && vtoks[1].length)
					copyVert(oldVecs.vt, parseInt(vtoks[1])-1, output.texCoords, indexCounter);
				if(vtoks.length > 2 && vtoks[2].length)
					copyVert(oldVecs.vn, parseInt(vtoks[2])-1, output.normals, indexCounter);
				
				vertices[vertKey] = vertIndex = indexCounter++;
			}
			
			output.indices.push(vertIndex);
		}
	}
	
	if(!output.texCoords.length) delete output.texCoords;
	if(!output.normals.length) delete output.normals;
	
	return output;
}
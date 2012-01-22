use mugs
db.mugs.drop();
db.mugs.ensureIndex({src:1, color:1, scale:1}, {unique:true, dropDups:true});
db.mugs.save({
	img: '2e.png',
	color: '#ffffff',
	scale: 1.5
});
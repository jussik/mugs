use mugs
db.mugs.drop();
db.mugs.ensureIndex({src:1, color:1, scale:1}, {unique:true, dropDups:true});
db.mugs.save({
	src: '2e4ed85a249e0d819df884d55176c16c.png',
	color: '#ffffff',
	scale: 1.5
});
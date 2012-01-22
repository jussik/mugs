use mugs
db.mugs.ensureIndex({src:1, color:1, scale:1}, {unique:true, dropDups:true});
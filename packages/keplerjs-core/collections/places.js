
Places = new Mongo.Collection('places');

if(Meteor.isServer)
	Places._ensureIndex({"loc": "2d"});

//TODO limt hist size
//http://stackoverflow.com/questions/21466297/slice-array-in-mongodb-after-addtoset-update
// $addToSet: {
// 	checkins: this.userId,
// 	hist: { $each: [this.userId], $slice: 5t }
// }
//TODO
// $addToSet: {
// 	hist: { $each: [placeId], $slice: 5 }
// }

//doc of before.insert in https://github.com/matb33/meteor-collection-hooks
Places.before.insert(function(userId, doc) {
	doc.createdAt = K.Util.time();
	doc.userId = userId;
	//doc.name = K.util.sanitizeName(doc.name)
	//doc.loc = K.Util.geo.roundLoc(doc.loc);
});

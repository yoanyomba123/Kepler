
K.extend({
	findPlacesImportByUserId: function(userId) {
		return Places.find({
			'import.name': {$exists:true},
			'userId': userId
		}, _.deepExtend({}, K.filters.placeItem, {
				sort: { createdAt: -1 },
				limit: 20
			})
		);
	}
});
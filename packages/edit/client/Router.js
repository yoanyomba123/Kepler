
Router.map(function() {

	this.route('panelPlaceEdit', {
		path: '/place/:placeId/edit',
		template: 'panelPlaceEdit',
		layoutTemplate: 'layoutMap',
		waitOn: function() {
			Session.set('showSidebar', true);
			return Meteor.subscribe('placeById', this.params.placeId);
		},
		data: function() {
			if(!this.ready()) return null;
			
			var place = K.placeById( this.params.placeId );

			if(!place) {
				Router.go('root');
				return null;
			}

			return place.rData();
		}
	});

	this.route('panelPlacesEdit', {
		path: '/places/edits',
		template: 'panelList',
		layoutTemplate: 'layoutMap',
		waitOn: function() {
			Session.set('showSidebar', true);
			return Meteor.subscribe('placesByIds', K.Profile.data.places);
		},
		data: function() {
			if(!this.ready()) return null;
			return {
				title: i18n('label_editplaces'),
				className: 'edits',
				itemsTemplate: 'item_place_edit',
				items: _.map(K.Profile.data.places, function(id) {
					return place = K.placeById(id);
				}),
				sortBy: 'createdAt',
				sortDesc: true
			};
		}
	});	
	
});
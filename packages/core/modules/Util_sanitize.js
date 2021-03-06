
Kepler.Util.sanitize = {

	text: function(body) {
		body = _.str.stripTags(body);
		body = _.str.trim(body);

		//body = _.escape(body);
		//TODO more filter msg
		
		return body;
	},

	regExp: function(text) {
		return text && text.replace(new RegExp("[({[^.$*+?\\\]})]","g"),'');
	},

	name: function(name) {
		name = name || '';
/*		name = name.toLowerCase()
			.replace(/_+/g,' ')
			.replace(/-+/g,' ')
			.replace(/’+/g,'\'')
			.replace(/[^a-z0-9\.'\- ]/g,'');*/

		name = _.str.unescapeHTML(name) || '';
		name = _.str.stripTags(name) || '';
		name = _.str.clean(name) || '';

		return name.substr(0,255);
	},

	/**
	 * return same name with added incremental number at tail
	 * @param  {[type]} name [description]
	 * @param  {[type]} sep  [description]
	 * @return {[type]}      [description]
	 */
	nthName: function(name, sep) {
		sep = sep || '';
		var m = name.match(/([^0-9]+)([0-9]+)$/),
			nameo = m ? m[1] : name,
			n2 = m ? parseInt(m[2],10) : 0,
			n = n2 ? ++n2 : 2;
		return nameo + sep + n;
	},

	username: function(name) {
		name = name || '';

		if(Meteor.isServer && Latinize)
			name = Latinize(name);

		name = name.toLowerCase()
			.replace(/’+/g,'\'')
			.replace(/[ ]/g,'.')
			.replace(/[^a-z0-9\.\-_]/g,'')
			.replace(/[\.]{2,}/g,'.')
			.replace(/[\-]{2,}/g,'-');
		name = _.str.clean(name) || '';
		return name.substr(0,16);
	},

	fileName: function(name, trimExt) {
		name = name || '';
		name = trimExt ? name.split('.').slice(0, -1).join('.') : name;
		return name.toLowerCase()
			.replace(/ +/g,'_')
			.replace(/[^a-z0-9\\\-\._]/g,'')
			.replace(/\.\./g,'.')
			.replace(/\//g,'');
	},

	fileExt: function(name) {
		return (name.split('.').pop()+"").toLowerCase();
	},

	url: function(url) {
		if(!url.match(/^[a-zA-Z]+:\/\//))
			url = 'http://'+url;
		return url;
	}
};
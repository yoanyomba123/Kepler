/*
	simple and smart caching system key/value for client and server
*/
//TODO memory cache level.. without use db
//TODO loop to clean expired caches or via api
//TODO store collection in localstorage
//TODO
//if(Meteor.isServer)
//	this._collections[namespace]._ensureIndex({ loc : "2dsphere" });
//	
//TODO
//this._collections[namespace]._createCappedCollection(numBytes);

/**
 * Kepler key/value Caching module
 * @type {Object}
 */
Kepler.Cache = {

	sep: '_',

	prefix: 'cache',
	
	_collections: {},
	
	_getCollection: function(namespace) {

		namespace = _.isString(namespace) ? this.prefix + this.sep + namespace : this.prefix;

		var opts = {idGeneration: 'STRING'};

		if(Meteor.isClient)
			opts.connection = null;
		
		if(!this._collections[namespace]) {

			this._collections[namespace] = new Mongo.Collection(namespace, opts);
			
			console.log('Cache: new namespace ', namespace);
		}

		return this._collections[namespace];
	},
	/**
	 * generate key by any objects
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	_keygen: function(key) {
		key = _.isArray(key) ? key.join(this.sep) : key;
		key = _.isObject(key) ? JSON.stringify(key) : key;
		return key;
	},
	/**
	 * generate future date of expiration
	 * @param  {String} expire 'minutely'|'hourly'|'daily'|'weekly'|'monthly' or seconds number
	 * @return {[type]}        date timestamp
	 */
	_expiregen: function(expire) {

		expire = _.isUndefined(expire) ? 'daily' : expire;

		var expires = {
			'none':     0,
			'minutely': 60,
			'hourly':   60*60,
			'daily':    60*60*24*1,
			'weekly':   60*60*24*7,
			'monthly':  60*60*24*30,
			'yearly':   60*60*24*30*12
		},
		exp = _.isNumber(expire) ? expire : expires[expire];

		return parseInt( K.Util.time() + exp*1000 );
	},
	/**
	 * create or update cache record
	 * @param {String|Array|Object}
	 * @param {Any}
	 * @param {String} namespace fir organize same cache values
	 * @param {String} cache value duration, possible values is: minutely|hourly|daily|weekly|monthly|yearly
	 */
	set: function(key, val, namespace, expire) {

		var idKey = this._keygen(key);
		
		var set = {val: val};
		
		if(expire)
			set.expire = this._expiregen(expire);

		this._getCollection(namespace).upsert(idKey, {$set: set });
		
		return val;
	},
	/**
	 * get value from cache, if not exists set new by valFunc and return it
	 * @param  {[type]}
	 * @param  {[type]}
	 * @param  {[type]}
	 * @param  {[type]}
	 * @return {[type]}
	 */
	get: function(key, namespace, valFunc, expire) {	//if value is not setted it's updated from valFunc

		var idKey = this._keygen(key);

		valFunc = _.isFunction(namespace) ? namespace : valFunc;

		var doc = this._getCollection(namespace).findOne(idKey);

		if(doc && doc.expire && K.Util.time() > doc.expire) {
			this._getCollection(namespace).remove(idKey);
			doc = {val: undefined};
		}

		doc = doc || {val: undefined};
		
		if(_.isFunction(valFunc) && doc.val===undefined)
			doc.val = this.set(idKey, valFunc(key), namespace, expire);

		return doc.val;
	},
	/**
	 * remove all cache value having same namespace
	 * @param  {String}
	 * @return {[type]}
	 */
	clean: function(namespace) {
		this._getCollection(namespace).remove({});
	}
};


//TODO advanced caching system based on reticula of bounding boxes

/*
var Utils = {
  long2tile: function (lon,zoom) {
  	return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
  },
  lat2tile: function (lat,zoom)  {
    return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
  },
  tile2long: function (x,z) {
    return (x/Math.pow(2,z)*360-180);
  },
  tile2lat: function (y,z) {
    var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
  },
  
  view2BBoxes: function(l,b,r,t) {
    //console.log(l+"\t"+b+"\t"+r+"\t"+t);
    //this.addBBox(l,b,r,t);
    //console.log("calc bboxes");
    var requestZoomLevel= 14;
    //get left tile index
    var lidx = this.long2tile(l,requestZoomLevel);
    var ridx = this.long2tile(r,requestZoomLevel);
    var tidx = this.lat2tile(t,requestZoomLevel);
    var bidx = this.lat2tile(b,requestZoomLevel);

    //var result;
    var result = [];
    for (var x=lidx; x<=ridx; x++) {
      for (var y=tidx; y<=bidx; y++) {//in tiles tidx<=bidx
        var left = Math.round(this.tile2long(x,requestZoomLevel)*1000000)/1000000;
        var right = Math.round(this.tile2long(x+1,requestZoomLevel)*1000000)/1000000;
        var top = Math.round(this.tile2lat(y,requestZoomLevel)*1000000)/1000000;
        var bottom = Math.round(this.tile2lat(y+1,requestZoomLevel)*1000000)/1000000;
        //console.log(left+"\t"+bottom+"\t"+right+"\t"+top);
        //this.addBBox(left,bottom,right,top);
        //console.log("http://osm.org?bbox="+left+","+bottom+","+right+","+top);
        result.push([[bottom,left],[top, right]]);
      }
    }
    //console.log(result);
    return result;
  },

  addBBox: function (l,b,r,t) {
    var polygon = L.polygon([
      [t, l],
      [b, l],
      [b, r],
      [t, r]
    ]).addTo(this._map);
  }

};

Utils.view2BBoxes(
    this._map.getBounds()._southWest.lng,
    this._map.getBounds()._southWest.lat,
    this._map.getBounds()._northEast.lng,
    this._map.getBounds()._northEast.lat);
//*/
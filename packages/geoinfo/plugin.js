
K.Plugin({
	name: 'geoinfo',
	templates: {
		panelPlaceEdit: {
			'panelPlaceEdit_geoinfo_tips':{order:0},
			'panelPlaceEdit_geoinfo_reload':{order:10},
		},
		tabPlace: 'tabPlace_geoinfo',
		tabLocation: 'tabLocation_geoinfo',
		popupCursor: 'popupCursor_geoinfo'
	},	
	schemas: {
		place: {
			geoinfo: {
				loc: [],	//location
				ele: 0,	//elevation
				esp: 0,	//aspect
				prov: '',	//province
				near: '',	//locality
				com: '',	//municipality
				reg: '',	//district
				naz: '',	//country
			}
		}
	},
	filters: {
		placePanel: {
			fields: {
				geoinfo: 1
			}
		}
	},
	settings: {
		"public": {
			"geoinfo": {
				"fields": {	//active fields
					"loc": true,
					"ele": true,
					"esp": true,
					"prov": true,
					"near": true,
					"com": true,
					"reg": true,
					"naz": true,
					"sunrise":true,
					"sunset": true
				}
			}
		},
		"geoinfo": {
			"caching": true,
			"autoupdate": true,
			"geonamesUser": "",
			"ipinfodbKey": ""
		}
	}
});
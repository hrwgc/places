mapbox.load('herwig.map-siz5m7we', function(o) {
	var map = mapbox.map('map');
	map.addLayer(o.layer);
	map.zoom(4).center({
		lat: -28.613,
		lon: 144.14
	}).setPanLimits([{
		lat: -85.0511,
		lon: -180
	}, {
		lat: 85.05115,
		lon: 180
	}]);
	map.setZoomRange(2, 8);
	map.interaction.auto(map);
	map.interaction.on({
		on: function(o) {
			// This will only listen to mousemoves. You can also look
			// for clicks or any other event or combination of events.
			if (o.e.type === 'mousemove') {
				// insert custom interactivity functions here
				// map data is contained in o.data.[data_column_name]
				// an easy way to see contents of data in mbtile is to include the following here: 
				// first, clear the element containing previous interactivity
				$('#custom-interactivity').empty();
				$('#custom-interactivity').append("<pre class='prettyprint language-js'>" + JSONFormat(JSON.stringify(o.data)) + "</pre>");
				prettyPrint();
				// then append the data to the parent element using your custom html/styling
		        $('#custom-interactivity')
		           .append(
			               "<img src='"
			               + o.data.image
			               + "' height='150px' /><h4><span>Name:</span><span class='data'>"
			               + o.data.full_name 
			               + "</span></h4>");
		      }
		  },
		off: function() {}
	});
});

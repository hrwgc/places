var map = mapbox.map('map');
mapbox.load('herwig.map-0g1xpajs', function (o) {
    map.addLayer(o.layer);
});


map.ui.zoomer.add();
map.ui.zoombox.add();
map.ui.attribution.add();
map.interaction.auto();
map.setZoomRange(6, 12);
map.ui.hash.add();
map.zoom(8).center({
    lat: 32.604,
    lon: 69.791
});


function fusionTables(id, callback) {
    if (typeof reqwest === 'undefined') {
        throw 'CSV: reqwest required for mmg_csv_url';
    }

    function response(x) {
        var features = [],
            latfield = '',
            lonfield = '';
        if (!x || !x.rows) return features;
        for (var i = 0; i < x.rows.length; i++) {
            var entry = x.rows[i];
            var location = entry[0];
            var strikeId = entry[1];
            var bureauId = entry[2];

            var re = /^([^\-]{1,})-([^\-]+)-([^\-]+)$/;
            var origDate = entry[3];
            var date = Date.parse(origDate.replace(re, "$2 $1, 20$3"))
            var area = entry[4];
            var target = entry[5];
            var targetGroup = entry[6];
            var minimumTotalKilled = entry[7];
            var numberOfDeaths = entry[8];
            var civiliansKilled = entry[9];
            var injured = entry[10];
            var childrenKilled = entry[11];
            var summary = entry[12];
            var latitude = entry[13];
            var longitude = entry[14];
            var feature = {
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                properties: {
                    "marker-color": "#ff0000",
                    "marker-size": "small",
                    "marker-symbol": "heliport",
                    "title": "<h2>" + location + "</h2>",
                    "date": date,
                    "description": "<table><thead><tr><th>Type</th><th>Number</th></tr></thead><tbody>" + "<tr><td>Total Deaths</td><td>" + numberOfDeaths + "</td></tr>" + "<tr><td>Minimum Total Killed</td><td>" + minimumTotalKilled + "</td></tr>" + "<tr><td>Civilians Killed</td><td>" + civiliansKilled + "</td></tr>" + "<tr><td>Children Killed</td><td>" + childrenKilled + "</td></tr>" + "<tr><td>Number Injured</td><td>" + injured + "</td></tr>" + "</tbody></table>"
                }
            };
            features.push(feature);
        }

        return callback(features);
    }
    var key = "AIzaSyATjmrN-_hALhmD62zhZLh4EanrmwT-mjE";
    var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20FROM%20' + id + '&key=' + key + '&typed=false&callback=jsonp';
    $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        success: response,
        error: response
    });
}


    var timeline = document.getElementById('timeline'),
        controls = document.getElementById('controls');


fusionTables('1dqxWkhKis38Lq5eLbzQz4gRRsH2ZROZXSn-Z0KQ', function (features) {
    features = _.map(features, function (f) {
        f.properties.title = f.properties.title
        f.properties.description = f.properties.description
        f.properties.date = f.properties.date
        return f;
    });
       function click_date(y) {
            return function () {
                var active = document.getElementsByClassName('year-active');
                if (active.length) active[0].className = '';
                document.getElementById('y' + y).className = 'year-active';
                markerLayer.filter(function (f) {
                    return f.properties.date == y;
                });
                return false;
            };
        }
    var markerLayer = mapbox.markers.layer()
        .features(features)
        var dates = {},
        datelist = []
        console.log(features)
        for (var i = 0; i < features.length; i++) {
            dates[features[i].properties.date] = true;
        }
        for (var y in dates) datelist.push(y);
        datelist.sort();
        console.log(datelist)
        for (var i = 0; i < datelist.length; i++) {
            var a = timeline.appendChild(document.createElement('a'));
            a.innerHTML = datelist[i] + ' ';
            a.id = 'y' + datelist[i];
            a.href = '#';
            a.onclick = click_date(datelist[i]);
        }
                console.log(dates)
                console.log(datelist)

        var stop = controls.appendChild(document.createElement('a')),
            play = controls.appendChild(document.createElement('a')),
            playStep;

        stop.innerHTML = 'STOP ■';
        play.innerHTML = 'PLAY ▶';

        play.onclick = function () {
            var step = 0;
            playStep = window.setInterval(function () {
                if (step < datelist.length) {
                    click_date(datelist[step])();
                    step++;
                } else {
                    window.clearInterval(playStep);
                }
            }, 250);
        };

        stop.onclick = function () {
            window.clearInterval(playStep);
        };
                click_date(1087444800000)();
    
    map.addLayer(markerLayer);
    });




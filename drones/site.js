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
    lat: 32.886,
    lon: 70.467
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
            var bureauId = entry[1];
            var re = /^([^\-]{1,})-([^\-]+)-([^\-]+)$/;
            var origDate = entry[2];
            var date = Date.parse(origDate.replace(re, "$2 $1, 20$3"))
            var dateStr = origDate.replace(re, "$2 $1, 20$3")
            var area = entry[3];
            var numberOfDeaths = entry[4];
            var str = entry[4]
            var minTotalDeaths = parseInt(str.split('-')[0]);
            if (str.split('-').length > 1) {
                var maxTotalDeaths = parseInt(str.split('-')[1]);
                var avgTotalDeaths = (minTotalDeaths + maxTotalDeaths)/2
            }
            else {
                var avgTotalDeaths = parseInt(str) || 0;
                var minTotalDeaths = 0;
                if (avgTotalDeaths.length < 1) {avgTotalDeaths = 0}
                var maxTotalDeaths = avgTotalDeaths;

            }
// set up new mins/maxs for computation of rates
            var str = entry[5]
            // prevent entries with blank cells for civilian deaths from converting to "zero"
            if  (str.length > 0) {
                var minCivDeaths = parseInt(str.split('-')[0]);
                if (str.split('-').length > 1) {
                   var maxCivDeaths = parseInt(str.split('-')[1]);
                   var avgCivDeaths = (minTotalDeaths + maxTotalDeaths)/2
                } else {
                   var avgCivDeaths = parseInt(str) || 0;
                   var minCivDeaths = 0;
                if (avgCivDeaths.length < 1) {avgTotalDeaths = 0}
                   var maxCivDeaths = avgTotalDeaths;
                }
                var civMortalityRate = avgCivDeaths / avgTotalDeaths || "unable to calculate"
            }
            if(str.replace(/[a-zA-Z]{1,}/,'') != "" == false) {
                  var maxCivDeaths = "";
                  var minCivDeaths = "";
                  var avgCivDeaths = "";
                  var civMortalityRate = "";
             }
            var civiliansKilled = entry[5];

            var childrenKilled = entry[6];
            var summary = entry[7];
            var latitude = entry[8];
            var longitude = entry[9];
            var feature = {
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                properties: {
                    "marker-color": "#ff0000",
                    "marker-size": "small",
                    "marker-symbol": "heliport",
                    "title": location,
                    "date": date,
                    "dateStr": dateStr,
                    "avgTotalDeaths" : avgTotalDeaths,
                    "minTotalDeaths": minTotalDeaths,
                    "maxTotalDeaths": maxTotalDeaths,
                    "description": "<h3>" + dateStr + "</h3><p>" + summary + "</p><table class='table table-hover table-condensed table-bordered'><thead></thead><tbody>" + "<tr><td>Total Deaths</td><td>" + numberOfDeaths + "</td></tr>" + "<tr><td>Civilians Killed</td><td>" + civiliansKilled + "</td></tr>" + "<tr><td>Children Killed</td><td>" + childrenKilled + "</td></tr></tbody></table>"
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
var scale_factory_cache = {};
    function scale_factory(feature) {
    var dim = Math.round((feature.properties.avgTotalDeaths +1) * 1.5);
    if (!scale_factory_cache[dim]) {
        var c = document.createElement("canvas");
        c.width = dim;
        c.height = dim;
        var ctx = c.getContext("2d");
        ctx.fillStyle = "rgba(220, 20, 56, 0.6)";
        ctx.strokeStyle = "rgb(103,10,26)";
        ctx.beginPath();
        ctx.arc(dim/2, dim/2, dim/Math.PI, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    var el = document.createElement("div");
    el.width = dim;
    el.height = dim;
    el.className = 'marker';
    //el.id = feature.properties.title.replace(/[ ]{1,}/, '').toLowerCase() + feature.properties.bid.toLowerCase();
   // el.src = scale_factory_cache[dim];
    el.style.cssText =
        "width:" + dim + "px;" +
        "height:" + dim + "px;" +
        "margin-left:" + (-dim/2) + "px;" +
        "margin-top:" + (-dim/2) + "px;" +
        "position:absolute";
    var ma = document.createElement("div");
    ma.className = 'drone-marker';
    el.appendChild(ma)
    var di = document.createElement("div");
    di.className = 'direction1';
    ma.appendChild(di)
    var di = document.createElement("div");
    di.className = 'direction2';
    ma.appendChild(di)
    return el;
    }

    var timeline = document.getElementById('timeline'),
        controls = document.getElementById('controls');
fusionTables('1dqxWkhKis38Lq5eLbzQz4gRRsH2ZROZXSn-Z0KQ', function (features) {
    features = _.map(features, function (f) {
        f.properties.title = f.properties.title
        f.properties.description = f.properties.description
        f.properties.date = f.properties.date
        f.properties.bid = f.properties.bid
        f.properties.minTotalDeaths = f.properties.minTotalDeaths
        f.properties.maxTotalDeaths = f.properties.maxTotalDeaths
        return f;
    });
       function click_date(y) {
            return function () {
                var active = document.getElementsByClassName('date-active');
                if (active.length) active[0].className = '';
                    
                    markerLayer.filter(function (f) {
                       return f.properties.date <= y;


                });
             return y;
        }
    }
    


    var markerLayer = mapbox.markers.layer()
        .factory(scale_factory).features(features)
        var strikes = {}
        var datelist = []
         for (var i = 0; i < features.length; i++) {
             strikes[features[i].properties.date] = {"geometry":features[i].properties.geometry, "title":   features[i].properties.title, "date": features[i].properties.date, "description" : features[i].properties.description, "dateStr": features[i].properties.dateStr, "minTotalDeaths": features[i].properties.minTotalDeaths, "maxTotalDeaths": features[i].properties.maxTotalDeaths};
      }
      for (var y in strikes) datelist.push(y);
      datelist.sort();

        var stop = controls.appendChild(document.createElement('a')),
            play = controls.appendChild(document.createElement('a')),
            playStep;

        stop.innerHTML = 'STOP ■';
        play.innerHTML = 'PLAY ▶';

        play.onclick = function () {
          //  map.removeLayer(markerLayer);
            var step = 0;
            playStep = window.setInterval(function () {
                if (step < datelist.length) {
                        click_date(datelist[step])();
                    $('#clock,#counter').css('display','block').css('background','#fff');
                    $('#description').css('background-color','#fff')
                    var min = parseInt($('#counter span#min').attr('value')) + strikes[datelist[step]].minTotalDeaths
                    if (strikes[datelist[step]].maxTotalDeaths.length <= 0) {
                        maxString = 0;
                    } else {
                        maxString = strikes[datelist[step]].maxTotalDeaths
                    };
                    var max = parseInt($('#counter span#max').attr('value')) + maxString;
                    $('#counter #min').empty().text(min).attr('value',min);
                    $('#counter #max').empty().text(max).attr('value',max);
                    $('#clock').empty();
                    $('#clock').append("<span class='date-active' id='y" + strikes[datelist[step]].dateStr + "'>" +  strikes[datelist[step]].dateStr + "</span><h3>" + strikes[datelist[step]].title + "</h3><div id='description'>" + strikes[datelist[step]].description + "</div>")
                    step++;
                } else {
                    window.clearInterval(playStep);
                }
            }, 750);
                mapbox.markers.interaction(markerLayer).remove()

        };

        stop.onclick = function () {
            window.clearInterval(playStep);
            mapbox.markers.interaction(markerLayer).add().showOnHover(false)
            $('#clock,#counter').css('display','none');
            $('#counter #min').text('0').attr('value','0');
            $('#counter #max').text('0').attr('value','0');



        };        
    map.addLayer(markerLayer);
    mapbox.markers.interaction(markerLayer).showOnHover(false)
    });

$('#clock').append("<span id='' class='date-active'></span>");

$(function () {
  //Modal Popup box for data
  $('a#learn-more').bind('click', openModal);

  function openModal() {
    $('#modal').fadeIn('fast');
    window.location.hash = 'learn-more'
    return false;
  }

  if (location.hash === '#learn-more') {
    openModal();
  }

  $('.close').click(function (e) {
    $('#overlay, #modal').fadeOut();
    window.location.hash = '';
    return false;
  });
});
var MapboxClient = require('mapbox/lib/services/datasets');
var dataset = 'cinboxanz004bwalx0ystu7ig';
var DATASETS_BASE = 'https://api.mapbox.com/datasets/v1/ramyaragupathy/' + dataset + '/';

var mapboxAccessDatasetToken = 'sk.eyJ1IjoicmFteWFyYWd1cGF0aHkiLCJhIjoiY2lvNTlobXRiMDFyMncza2p3M2FvaTFuNyJ9.8YSX2k7YzX6zU51el8HHBg';
var mapboxAccessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ';
mapboxgl.accessToken = mapboxAccessToken;
var mapbox = new MapboxClient(mapboxAccessDatasetToken);

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
    center: [77.4310, 14.7638], // starting position
    zoom: 11, // starting zoom
    hash: true,
    attributionControl: false
});

var streetFoodSource = new mapboxgl.GeoJSONSource({
    data:{}
});
var food, landmark;

var streetFoodLayer = {
    'id': 'mydataset',
    'type': 'circle',
    'source': 'streetFoodSource',
    'interactive': true,
    'layout': {
        visibility: 'visible'
    },
    'paint': {
        'circle-radius': 14,
        'circle-color': '#e62749',
        'circle-blur' : .9
    }
};



  
// Define switchable map layers

map.on('load', function () {
    
    map.addSource('streetFoodSource', streetFoodSource);

    map.addLayer(streetFoodLayer);

    getFeatures();
   
});


var newfeaturesGeoJSON = {
      "type": "Feature",
      "properties": {
        "What to order?": food,
        "Landmark": landmark
      },
      "geometry": {
        "coordinates": [
          
        ],
        "type": "Point"
      },
    
    }


   
map.on('click', function (e) {
    
        lnglat = JSON.stringify(e.lngLat);
        console.log(lnglat);
        var landmark = prompt("Specify a nearby landmark", "Near BDA Complex");
        console.log(landmark);
        var food = prompt("What to order from this place?", "Continental");
        console.log(food);
        var coordinates = JSON.parse(lnglat);
        newfeaturesGeoJSON.properties["What to order?"] = food;
        newfeaturesGeoJSON.properties["Landmark"] = landmark;
        newfeaturesGeoJSON.geometry.coordinates[0] = coordinates.lng
        newfeaturesGeoJSON.geometry.coordinates[1] = coordinates.lat;
        console.log(newfeaturesGeoJSON);
         mapbox.insertFeature(newfeaturesGeoJSON, dataset, function(err, response) {
          console.log(response);
        });
        featuresGeoJSON.features = featuresGeoJSON.features.concat(newfeaturesGeoJSON);
        streetFoodSource.setData(featuresGeoJSON);
});
   

var featuresGeoJSON = {
        'type': 'FeatureCollection',
        'features': []
};
   
function getFeatures() {
    
    var url = DATASETS_BASE + 'features';
    var params = {
        'access_token': mapboxAccessDatasetToken
    };
    
    $.getJSON(url, params, function (data) {
        
        if (data.features.length > 0) {
                data.features.forEach(function (feature) {
                    feature.properties.id = feature.id;
                });
                featuresGeoJSON.features = featuresGeoJSON.features.concat(data.features);
                streetFoodSource.setData(featuresGeoJSON);
               
            }
        
        streetFoodSource.setData(data);
        
    });
}





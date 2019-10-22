
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

var eqmarkers = [];
var newCoordinate = [];

function markersize(magnitude){
  return magnitude * 100000;
}

// Perform a GET request to the query URL
d3.json(url, function(data) {
  console.log(data.features[1]);
  var features = data.features;

  features.forEach(element => {
    
    //Get the coordinate of the earthquake
    var coordinate = element.geometry.coordinates;
    var coordinate = coordinate.slice(0,2);
    newCoordinate = [];
    newCoordinate.push(coordinate[1]);
    newCoordinate.push(coordinate[0]);
    
    //Get the magnitude of the earthquake
    var mag = element.properties.mag;
    console.log(mag);

    // Choose color based on earthquake
    var markercolor = '';
    
    if (mag > 4.5){
        markercolor ='#F87217';
    } else if (mag > 2.5){
        markercolor ='#FDD017';
    } else if (mag> 1){
        markercolor ='#FFF380';     
    } else {
        markercolor = '#BCE954';
    }

    //Get the time of earthquake
    var time = new Date(element.properties.time);
    //console.log(time);

    //create a marker for each earthquake
    eqmarkers.push(
      L.circle(newCoordinate, {
        color: markercolor,
        weight:1,
        fillColor: markercolor,
        fillOpacity: 0.7,
        radius: markersize(mag)
      }
      ).bindPopup("<h1>" + element.properties.place + "</h1> <hr> <h2>Magnitude: " + element.properties.mag + "</h2><hr> <h2>Time: "+ time+"</h2>")
    );
  }) ;
  
});

  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map

function wrapup(){
  console.log(eqmarkers);
  var markerLayer = L.layerGroup(eqmarkers); 
  
  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  
  //add a layer of plate boundaries
  var plates = L.geoJson(boundary,{color:'#46C7C7',weight: 2});

  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [light,markerLayer,plates]
  });
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light": light,
    "Satellite": satellite
  };
  
  // Define a overlayMaps object to hold our marker layers
  var overlayMaps = {
    
    "earthquake": markerLayer,
    "plates":plates

  }; 
  
  // create a layer control
  L.control.layers(baseMaps,overlayMaps).addTo(myMap);
  
}

// delay the draw of the maps to wait for query to be finished
setTimeout(wrapup, 2500);

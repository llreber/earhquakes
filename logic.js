// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});
function markerSize(mag) {
  return mag*5;
}
function markerColor(mag) {
  if (mag > 6) {
    color = "red"
  }else if(mag > 4) {
    color = "orange"
  }else if (mag > 2) {
    color = "yellow"
  } else {
    color = "green"
  };
  return color;
}



function createFeatures(earthquakeData) {

 
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    
    layer.bindPopup("<h3>" + feature.properties.place + 
    "</h3><hr><p>Magnitude: "+ feature.properties.mag +
      "</p><p>" + new Date(feature.properties.time) + "</p>");
  }

 // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          color: markerColor(feature.properties.mag),
          fillOpacity: 0.75
          }
      );
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    //var limits = geojson.options.limits;
    var colors = ["green","yellow", "orange","red"];
    var labels = ["Less than 2","Between 2 and 4", "Between 4 and 6", "Over 6"];

    //Add min & max
     var legendInfo = "<h3>Earthquake Magnitude</h3>" +
      "<div class=\"labels\">" +
      "<ul>"+
      "<li style=\"background-color: " + colors[0]+"\">" + labels[0]+"</li>"+
      "<li style=\"background-color: " + colors[1]+"\">" + labels[1]+"</li>"+
      "<li style=\"background-color: " + colors[2]+"\">" + labels[2]+"</li>"+
      "<li style=\"background-color: " + colors[3]+"\">" + labels[3]+"</li>"+
      "</div>"; 

    div.innerHTML = legendInfo;

    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}

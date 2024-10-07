// Initialize the map 
var mymap = L.map('map').setView([37.8, -96], 4);

// Add a tile layer to the map 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// URL to fetch earthquake data 
var earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch earthquake data and add to map
fetch(earthquakesUrl)
.then(function(response) {
return response.json(); 
})
.then(function(data) {
L.geoJSON(data, {
pointToLayer: function(feature, latlng) {
if (!feature.properties || !feature.geometry) {
console.error('Invalid feature skipped:', feature);
return;
}
var geojsonMarkerOptions = {
radius: 4 * feature.properties.mag,
fillColor: getColor(feature.geometry.coordinates[2]),
color: "#000",
weight: 1,
opacity: 1,
fillOpacity: 0.8
};
return L.circleMarker(latlng, geojsonMarkerOptions);
}
}).addTo(mymap);
});

// Function to determine marker color based on earthquake depth
function getColor(depth) {
return depth > 90 ? '#ff0000' :
depth > 70 ? '#ff4500' :
depth > 50 ? '#ff8c00' :
depth > 30 ? '#ffd700' :
depth > 10 ? '#ffff00' :
'#9acd32';
}

// Add a legend to the map for depth indication
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
var div = L.DomUtil.create('div', 'info legend'),
grades = [0, 10, 30, 50, 70, 90],
labels = [];
for (var i = 0; i < grades.length; i++) {
div.innerHTML +=
'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km');
}
return div;
};
legend.addTo(mymap);

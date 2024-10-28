       // Create the map
       var map = L.map('map').setView([0, 0], 2);

       // Add base layer
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
       }).addTo(map);

       // Load and add earthquake data
       d3.json('C:\Users\Mary Du\OneDrive\Desktop\Monash_Bootcamp\15_Data_Visualization_with_Leaflet\leaflet-challenge\Leaflet-Part-2\tectonicplates').then(function(data) {
           L.geoJSON(data, {
               pointToLayer: function(feature, latlng) {
                   return L.circleMarker(latlng, {
                       radius: feature.properties.mag * 2,
                       fillColor: getColor(feature.properties.depth),
                       color: '#000',
                       weight: 1,
                       opacity: 1,
                       fillOpacity: 0.8
                   }).bindPopup('<h3>Magnitude: ' + feature.properties.mag + '</h3><p>Depth: ' + feature.properties.depth + ' km</p>');
               }
           }).addTo(map);
       });

       // Load and add tectonic plates data
       d3.json('path/to/tectonic_plates.geojson').then(function(data) {
           L.geoJSON(data, {
               style: function(feature) {
                   return {
                       color: '#ff7800',
                       weight: 2,
                       opacity: 0.6
                   };
               }
           }).addTo(map);
       });

       // Function to get color based on depth
       function getColor(depth) {
           return depth > 90 ? '#800026' :
                  depth > 70 ? '#BD0026' :
                  depth > 50 ? '#E31A1C' :
                  depth > 30 ? '#FC4E2A' :
                  depth > 10 ? '#FD8D3C' :
                               '#FFEDA0';
       }
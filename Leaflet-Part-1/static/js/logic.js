// Initialize the map
let map = L.map("map").setView([0, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the URL for the earthquake data
let earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch earthquake data using D3.js
d3.json(earthquakeDataUrl).then(function(data) {
    // Define the depth ranges and corresponding colors
    let depthRanges = [-10, 10, 30, 50, 70, 90];
    let colorScale = d3.scaleThreshold()
        .domain(depthRanges)
        .range(["#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026", "#67001f"]);

    // Function to determine color based on depth
    function getColor(depth) {
        return colorScale(depth);  // Use the color scale to get the color
    }

    // Function to create markers and add them to the map
    function createFeatures(features) {
        features.forEach(function(feature) {
            let coords = feature.geometry.coordinates;
            let magnitude = feature.properties.mag;
            let depth = coords[2];
            let location = feature.properties.place;

            // Create a circle marker
            L.circleMarker([coords[1], coords[0]], {
                radius: magnitude * 2,  // Scale radius by magnitude
                fillColor: getColor(depth),  // Set the circle marker color based on depth
                color: 'black',       // Set the circle marker border color to black
                weight: 1,
                opacity: 1,
                fillOpacity: 1.5
            }).bindPopup('<b>Location:</b> ' + location + '<br><b>Magnitude:</b> ' + magnitude + '<br><b>Depth:</b> ' + depth + ' km')
              .addTo(map);
        });

        // Create and add the legend
        let legend = L.control({ position: 'bottomright' });

        legend.onAdd = function () {
            let div = L.DomUtil.create('div', 'legend');
            div.innerHTML = '<h4>Depth (km)</h4>';
            div.style.backgroundColor = 'white';  // Set the background color to white
            div.style.padding = '10px';  // Add some padding for better appearance

            // Create the gradient color scale
            let gradient = 'linear-gradient(to bottom, ' +
                           '#fee08b, ' + // Color for -10 to 10 km
                           '#fdae61, ' + // Color for 10 to 30 km
                           '#f46d43, ' + // Color for 30 to 50 km
                           '#d73027, ' + // Color for 50 to 70 km
                           '#a50026, ' + // Color for 70 to 90 km
                           '#67001f)';   // Color for 90+ km

            // Create the gradient bar and labels container
            div.innerHTML += '<div style="display: flex; align-items: center;">' +
                            // Gradient bar
                            '<div style="width: 20px; height: 120px; background: ' + gradient + '; margin-right: 10px;"></div>' +
                            // Labels
                            '<div style="line-height: 20px;">' +
                                '<span style="display: block;">-10-10 km</span>' +
                                '<span style="display: block;">10-30 km</span>' +
                                '<span style="display: block;">30-50 km</span>' +
                                '<span style="display: block;">50-70 km</span>' +
                                '<span style="display: block;">70-90 km</span>' +
                                '<span style="display: block;">90+ km</span>' +
                            '</div>' +
                           '</div>';

            return div;
        };

        legend.addTo(map);
    }

    // Call the function to create features and add them to the map
    createFeatures(data.features);
}).catch(error => console.error('Error fetching the data:', error));

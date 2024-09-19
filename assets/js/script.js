document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([49.5757534, 11.0201618], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    var markerGroups = {};

    // Function to return a custom icon based on the category
    function getCategoryIcon(category) {

        var iconUrl = mapOpenstreetData.icons[category] || mapOpenstreetData.icons.default; // Default icon if category not matched
        return L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 41], // Size of the icon
            iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
            popupAnchor: [0, -10]  // Point from which the popup should open relative to the iconAnchor
        });
    }

    fetch(mapOpenstreetData.dataUrl)
        .then(response => response.json())
        .then(data => {
            data.locations.forEach(function (item) {
                var category = item.category;
                var address = item.address;
                if (!markerGroups[category]) {
                    markerGroups[category] = L.layerGroup().addTo(map);
                }

                var customIcon = getCategoryIcon(category);
                var marker = L.marker([item.latitude, item.longitude], { icon: customIcon })
                    .bindPopup(`<strong>${item.Name}</strong><br/>Kategorie: ${item.category}` +
                        (item.address ? `<br/>Adresse: ${item.address}` : '') +
                        (item.category === 'E-Ladesäule' ? `<br/>Nur für FAU-Angehörige` : ''));

                marker.addTo(markerGroups[category]);
            });

            // Add layer control feature
            L.control.layers(null, markerGroups, { collapsed: false }).addTo(map);
        })
        .catch(error => console.error('Error loading the data: ', error));
});
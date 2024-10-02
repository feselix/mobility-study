document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([49.5757534, 11.0201618], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: mapMobilityData.translations.openStreetMap
    }).addTo(map);

    var markerGroups = {};

    function getCategoryIcon(category) {
        var normalizedKey = category.toLowerCase().replace(/[\s-]+/g, '_'); // This will replace spaces and hyphens with underscores
        var iconUrl = mapMobilityData.icons[normalizedKey] || mapMobilityData.icons.default;
        // console.log("Normalized Key: ", normalizedKey);  // For debugging
        //  console.log("Icon URL: ", iconUrl);  // For debugging
        return L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 12],
            popupAnchor: [0, -10]
        });
    }

    fetch(mapMobilityData.dataUrl)
        .then(response => response.json())
        .then(data => {
            data.locations.forEach(function (item) {
                var category = item.category;
                var translatedCategory = mapMobilityData.translations[category] || category;
                var address = item.address;
                if (!markerGroups[translatedCategory]) {
                    markerGroups[translatedCategory] = L.layerGroup().addTo(map);
                }

                var customIcon = getCategoryIcon(category); // Ensure correct function usage
                var marker = L.marker([item.latitude, item.longitude], { icon: customIcon })
                    .bindPopup(`<strong>${item.Name}</strong><br/>${mapMobilityData.translations.category}: ${translatedCategory}` +
                        (item.address ? `<br/>${mapMobilityData.translations.address}: ${item.address}` : '') +
                        (category === 'E-Ladesäule' ? `<br/>${mapMobilityData.translations.onlyForMembers}` : ''));

                marker.addTo(markerGroups[translatedCategory]);
            });

            L.control.layers(null, markerGroups, { collapsed: false }).addTo(map);
        })
        .catch(error => console.error(mapMobilityData.translations.errorLoadingData, error));
});
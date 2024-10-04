const data = [
    {
        distance: 'bis unter 2,5 km',
        students: { foot: 0.308, bike: 0.548, opnv: 0.137, miv: 0.006, other: 0.001, total: 586 },
        employees: { foot: 0.278, bike: 0.666, opnv: 0.044, miv: 0.007, other: 0.004, total: 250 }
    },
    {
        distance: '2,5 bis unter 5 km',
        students: { foot: 0.027, bike: 0.555, opnv: 0.383, miv: 0.032, other: 0.003, total: 623 },
        employees: { foot: 0.025, bike: 0.773, opnv: 0.128, miv: 0.07, other: 0.003, total: 302 }
    },
    {
        distance: '5 bis unter 10 km',
        students: { foot: 0.013, bike: 0.427, opnv: 0.488, miv: 0.069, other: 0.002, total: 366 },
        employees: { foot: 0.002, bike: 0.648, opnv: 0.163, miv: 0.187, other: 0, total: 290 }
    },
    {
        distance: '10 bis unter 25 km',
        students: { foot: 0, bike: 0.052, opnv: 0.764, miv: 0.184, other: 0, total: 777 },
        employees: { foot: 0.003, bike: 0.144, opnv: 0.349, miv: 0.502, other: 0.002, total: 529 }
    },
    {
        distance: '25 bis unter 50 km',
        students: { foot: 0, bike: 0.002, opnv: 0.71, miv: 0.288, other: 0, total: 525 },
        employees: { foot: 0, bike: 0.019, opnv: 0.391, miv: 0.59, other: 0, total: 287 }
    },
    {
        distance: '50 km und mehr',
        students: { foot: 0, bike: 0, opnv: 0.799, miv: 0.201, other: 0, total: 244 },
        employees: { foot: 0, bike: 0, opnv: 0.576, miv: 0.424, other: 0, total: 135 }
    },
];

const students = 3121;
const employees = 1793;

const co2EmissionRates = {
    foot: 0,
    bike: 9,
    opnv: 60,
    miv: 169,
    other: 0
};

const distancesInKm = [2.5, 5, 10, 25, 50, Infinity];

const colors = {
    current: 'rgba(97,125,161,1)',  // Blau für "Ihr CO₂-Ausstoß"
    better: 'rgba(172,210,117,1)',  // Grün für Verbesserungen
    worse: 'rgba(221,115,124,1)'    // Rot für Verschlechterungen
};

function translateTransport(transport) {
    const translations = {
        foot: chartTranslations.on_foot,
        bike: chartTranslations.bicycle,
        opnv: chartTranslations.public_transport,
        miv: chartTranslations.car
    };
    return translations[transport] || transport;
}
function formatNumber(number) {
    return number.toFixed(2).replace('.', ',');
}

function calculateUserEmission() {
    const distance = parseFloat(document.getElementById('distance').value);
    const frequency = parseInt(document.getElementById('frequency').value);
    const transport = document.getElementById('transport').value;

    if (isNaN(distance) || isNaN(frequency)) {
        alert(chartTranslations.valid_distance);
        return null;
    }

    const emissionRate = co2EmissionRates[transport];
    const totalDistance = distance * 2; // Hin- und Rückweg
    const weeklyEmission = totalDistance * emissionRate * frequency;
    const yearlyEmission = weeklyEmission * 43.5; // 43.5 Wochen pro Jahr
    return yearlyEmission / 1000; // Umrechnung in kg
}

function getTransportPhrase(transport) {
    const transportPhrases = {
        'Zu Fuß': chartTranslations.on_foot || null,
        'Fahrrad': chartTranslations.bicycle || null,
        'ÖPNV': chartTranslations.public_transport || null,
        'Auto': chartTranslations.car || null,
        'Car': chartTranslations.car || null,
        'Bicycle': chartTranslations.bicycle || null,
        'public_transport': chartTranslations.public_transport || null,
        'Public Transport': chartTranslations.public_transport || null,
        'On foot': chartTranslations.on_foot || null

    };





    return transportPhrases[transport];
}


function updateChart() {
    const userEmission = calculateUserEmission();
    if (userEmission === null) return;

    const currentTransport = document.getElementById('transport').value;
    const userType = document.getElementById('userType').value;
    const distance = parseFloat(document.getElementById('distance').value);
    const frequency = parseInt(document.getElementById('frequency').value);
    const totalDistance = distance * 2 * frequency * 43.5; // Hin- und Rückweg, Frequenz pro Woche, 43.5 Wochen

    const emissionData = [
        { label: chartTranslations.foot || 'Zu Fuß', emission: (totalDistance * co2EmissionRates.foot) / 1000 },
        { label: chartTranslations.bicycle || 'Fahrrad', emission: (totalDistance * co2EmissionRates.bike) / 1000 },
        { label: chartTranslations.public_transport || 'ÖPNV', emission: (totalDistance * co2EmissionRates.opnv) / 1000 },
        { label: chartTranslations.car || 'Auto', emission: (totalDistance * co2EmissionRates.miv) / 1000 }
    ];


    // Erstelle die Daten für die Balken
    const barData = {
        label: 'CO₂-Ausstoß',
        data: emissionData.map(d => d.label === translateTransport(currentTransport) ? userEmission : d.emission),
        backgroundColor: emissionData.map(d => {
            if (d.label === translateTransport(currentTransport)) {
                return colors.current;
            } else if (d.emission < userEmission) {
                return colors.better;
            } else {
                return colors.worse;
            }
        }),
        borderColor: emissionData.map(d => {
            if (d.label === translateTransport(currentTransport)) {
                return colors.current;
            } else if (d.emission < userEmission) {
                return colors.better;
            } else {
                return colors.worse;
            }
        }),
        borderWidth: 1
    };

    // Aktualisiere das CO₂-Emissions-Diagramm
    co2Chart.data.datasets = [barData];
    co2Chart.data.labels = [
        chartTranslations.on_foot || 'Zu Fuß',
        chartTranslations.bicycle || 'Fahrrad',
        chartTranslations.public_transport || 'ÖPNV',
        chartTranslations.car || 'Auto'
    ];
    co2Chart.options.plugins.title.text = chartTranslations.your_current_co2_emission;
    co2Chart.update();

    // Nutzungsdaten berechnen
    let userDataset = data[0];
    for (let i = 0; i < data.length; i++) {
        if (distance <= distancesInKm[i]) {
            userDataset = data[i];
            break;
        }
    }

    const usageData = [
        { label: chartTranslations.on_foot, percentage: userDataset[userType].foot * 100 },
        { label: chartTranslations.bicycle, percentage: userDataset[userType].bike * 100 },
        { label: chartTranslations.public_transport, percentage: userDataset[userType].opnv * 100 },
        { label: chartTranslations.car, percentage: userDataset[userType].miv * 100 }
    ];

    // Aktualisiere das Modal-Split-Diagramm
    modalSplitChart.data.datasets = [{
        label: chartTranslations.usage_percent,
        data: usageData.map(d => d.percentage),
        backgroundColor: ['#041E42', '#0044A9', '#04316A', '#CED9E7'],
        borderColor: ['#041E42', '#0044A9', '#04316A', '#CED9E7'],
        borderWidth: 1
    }];
    modalSplitChart.data.labels = usageData.map(d => d.label);
    modalSplitChart.options.plugins.title.text = chartTranslations.modal_split_selected_distance || 'Modal Split of the selected distance';

    // Update the Y-axis title
    modalSplitChart.options.scales.y.title.text = chartTranslations.share_percentage || 'Share [%]';
    modalSplitChart.update();

    const currentUsage = usageData.find(d => d.label === translateTransport(currentTransport)).percentage;
    const lowestEmissionTransport = emissionData.reduce((prev, current) => prev.emission < current.emission ? prev : current);
    const highestUsageTransport = usageData.reduce((prev, current) => (prev.percentage > current.percentage) ? prev : current);

    // Ergebnisse anzeigen
    let resultHTML = `
    <h4>${chartTranslations.annual_co2_emissions} ${formatNumber(userEmission)} kg</h4>
    <h4>${chartTranslations.brief_analysis}</h4>
    <ul>
        <li>${getTransportPhrase(translateTransport(currentTransport))} ${chartTranslations.uses} ${formatNumber(currentUsage)}% ${chartTranslations.in_distance_category}</li>
        <li>${getTransportPhrase(lowestEmissionTransport.label)} ${chartTranslations.has_lowest_co2_with} ${formatNumber(lowestEmissionTransport.emission)} ${chartTranslations.kg_per_year}</li>
`;

    if (translateTransport(currentTransport) !== highestUsageTransport.label) {
        resultHTML += `<li>${getTransportPhrase(highestUsageTransport.label)} ${chartTranslations.most_used_transport} (${formatNumber(highestUsageTransport.percentage)}%).</li>`;

    }

    emissionData.forEach(d => {
        console.log(d.label);
        if (d.label !== translateTransport(currentTransport)) {
            const diff = userEmission - d.emission;
            if (diff > 0) {
                resultHTML += `<li>${getTransportPhrase(d.label)} ${chartTranslations.could_save_you} ${formatNumber(diff)} ${chartTranslations.kg_CO2_per_year}</li>`;


            } else if (diff < 0) {
                resultHTML += `<li>${getTransportPhrase(d.label)} ${chartTranslations.more_co2_per_year.replace('kg', formatNumber(Math.abs(diff)))}</li>`;

            }
        }
    });

    resultHTML += `
        </ul>
       <h4>${chartTranslations.assumptions}</h4>
        <p>${chartTranslations.average_weeks}</p>
    `;

    document.getElementById('result').innerHTML = resultHTML;
}

// Charts initialisieren
const ctx1 = document.getElementById('co2Chart').getContext('2d');
const co2Chart = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: [
            chartTranslations.on_foot || 'Zu Fuß',
            chartTranslations.bicycle || 'Fahrrad',
            chartTranslations.public_transport || 'ÖPNV',
            chartTranslations.car || 'Auto'
        ],
        datasets: []
    },
    options: {
        responsive: true,
        indexAxis: 'x',
        scales: {
            x: {
                ticks: {
                    color: 'black'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: chartTranslations.co2_equivalents
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    filter: function (item, chart) {
                        // Only show legend for the user's current transport mode
                        return item.text === chartTranslations.your_co2_emission;
                    }
                }
            },
            title: {
                display: true,
                text: chartTranslations.current_co2_emission
            }
        }
    }
});

const ctx2 = document.getElementById('modalSplitChart').getContext('2d');
const modalSplitChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: chartTranslations.share_percentage
                },
                max: 100
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: chartTranslations.modal_split_selected_distance || 'Modal Split der ausgewählten Entfernung'
            }
        }
    }
});

document.querySelector('button').addEventListener('click', updateChart);
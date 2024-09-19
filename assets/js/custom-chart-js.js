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
        foot: 'Zu Fuß',
        bike: 'Fahrrad',
        opnv: 'ÖPNV',
        miv: 'Auto'
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
        alert('Bitte geben Sie gültige Werte für Distanz und Häufigkeit ein.');
        return null;
    }

    const emissionRate = co2EmissionRates[transport];
    const totalDistance = distance * 2; // Hin- und Rückweg
    const weeklyEmission = totalDistance * emissionRate * frequency;
    const yearlyEmission = weeklyEmission * 43.5; // 43.5 Wochen pro Jahr
    return yearlyEmission / 1000; // Umrechnung in kg
}

function getTransportPhrase(transport) {
    switch (transport) {
        case 'Zu Fuß': return 'Zu Fuß';
        case 'Fahrrad': return 'Mit dem Fahrrad';
        case 'ÖPNV': return 'Mit dem ÖPNV';
        case 'Auto': return 'Mit dem Auto';
        default: return transport;
    }
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
        { label: 'Zu Fuß', emission: (totalDistance * co2EmissionRates.foot) / 1000 },
        { label: 'Fahrrad', emission: (totalDistance * co2EmissionRates.bike) / 1000 },
        { label: 'ÖPNV', emission: (totalDistance * co2EmissionRates.opnv) / 1000 },
        { label: 'Auto', emission: (totalDistance * co2EmissionRates.miv) / 1000 }
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
    co2Chart.data.labels = ['Zu Fuß', 'Fahrrad', 'ÖPNV', 'Auto'];
    co2Chart.options.plugins.title.text = 'Ihr aktueller CO₂-Ausstoß';
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
        { label: 'Zu Fuß', percentage: userDataset[userType].foot * 100 },
        { label: 'Fahrrad', percentage: userDataset[userType].bike * 100 },
        { label: 'ÖPNV', percentage: userDataset[userType].opnv * 100 },
        { label: 'Auto', percentage: userDataset[userType].miv * 100 }
    ];

    // Aktualisiere das Modal-Split-Diagramm
    modalSplitChart.data.datasets = [{
        label: 'Nutzung (%)',
        data: usageData.map(d => d.percentage),
        backgroundColor: ['#041E42', '#0044A9', '#04316A', '#CED9E7'],
        borderColor: ['#041E42', '#0044A9', '#04316A', '#CED9E7'],
        borderWidth: 1
    }];
    modalSplitChart.data.labels = usageData.map(d => d.label);
    modalSplitChart.options.plugins.title.text = 'Modal Split der ausgewählten Entfernung';
    modalSplitChart.options.scales.y.title.text = 'Anteil [%]';
    modalSplitChart.update();

    const currentUsage = usageData.find(d => d.label === translateTransport(currentTransport)).percentage;
    const lowestEmissionTransport = emissionData.reduce((prev, current) => prev.emission < current.emission ? prev : current);
    const highestUsageTransport = usageData.reduce((prev, current) => (prev.percentage > current.percentage) ? prev : current);

    // Ergebnisse anzeigen
    let resultHTML = `
        <h4>Ihr jährlicher CO₂-Ausstoß beträgt: ${formatNumber(userEmission)} kg</h4>
        <h4>Kurzanalyse:</h4>
        <ul>
            <li>${getTransportPhrase(translateTransport(currentTransport))} nutzen ${formatNumber(currentUsage)}% der ${userType === 'students' ? 'Studierenden' : 'Mitarbeitenden'} in Ihrer Entfernungskategorie.</li>
            <li>${getTransportPhrase(lowestEmissionTransport.label)} hat den geringsten CO₂-Ausstoß mit ${formatNumber(lowestEmissionTransport.emission)} kg pro Jahr.</li>
    `;

    if (translateTransport(currentTransport) !== highestUsageTransport.label) {
        resultHTML += `<li>${getTransportPhrase(highestUsageTransport.label)} ist das meistgenutzte Verkehrsmittel (${formatNumber(highestUsageTransport.percentage)}%).</li>`;
    }

    emissionData.forEach(d => {
        if (d.label !== translateTransport(currentTransport)) {
            const diff = userEmission - d.emission;
            if (diff > 0) {
                resultHTML += `<li>${getTransportPhrase(d.label)} könnten Sie ${formatNumber(diff)} kg CO₂ pro Jahr einsparen.</li>`;
            } else if (diff < 0) {
                resultHTML += `<li>${getTransportPhrase(d.label)} würden Sie ${formatNumber(Math.abs(diff))} kg CO₂ mehr pro Jahr ausstoßen.</li>`;
            }
        }
    });

    resultHTML += `
        </ul>
        <h4>Annahmen:</h4>
        <p>Aufgrund vorlesungsfreier Zeit bzw. Urlaubs- und Feiertage rechnen wir im Durchschnitt mit 43,5 Wochen pro Jahr, in denen zur FAU gefahren wird.</p>
    `;

    document.getElementById('result').innerHTML = resultHTML;
}

// Charts initialisieren
const ctx1 = document.getElementById('co2Chart').getContext('2d');
const co2Chart = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['Zu Fuß', 'Fahrrad', 'ÖPNV', 'Auto'],
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
                    text: 'CO₂-Äquivalente [kg/Jahr]'
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
                        return item.text === 'Ihr CO₂-Ausstoß';
                    }
                }
            },
            title: {
                display: true,
                text: 'Ihr aktueller CO₂-Ausstoß'
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
                    text: 'Anteil [%]'
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
                text: 'Modal Split der ausgewählten Entfernung'
            }
        }
    }
});

document.querySelector('button').addEventListener('click', updateChart);
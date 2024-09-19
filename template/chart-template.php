<h3>FAU CO₂-Emissions-Rechner</h3>
<p>Ermitteln Sie Ihren aktuellen CO₂-Ausstoß, entdecken Sie Einsparmöglichkeiten durch alternative Verkehrsmittel und sehen Sie, wie Sie im Vergleich zu anderen abschneiden.</p>
<div class="input-container">
    <label for="distance">Meine Wegstrecke zur FAU in km:</label>
    <input type="number" id="distance" step="0.1" class="form-control mb-2" placeholder="z.B. 4,5" aria-required="true">

    <label for="frequency">Fahrten pro Woche:</label>
    <input type="number" id="frequency" min="1" max="7" class="form-control mb-2" placeholder="z.B. 5" aria-required="true">

    <label for="transport">Verkehrsmittel:</label>
    <select id="transport" class="form-select mb-2" aria-required="true">
        <option value="" disabled selected>- Verkehrsmittel wählen -</option>
        <option value="foot">Zu Fuß</option>
        <option value="bike">Fahrrad / E-Rad / E-Roller / Pedelec</option>
        <option value="opnv">ÖPNV</option>
        <option value="miv">Auto</option>
    </select>

    <label for="userType">Ich bin:</label>
    <select id="userType" class="form-select mb-2" aria-required="true">
        <option value="" disabled selected>- Auswählen -</option>
        <option value="students">Student/in</option>
        <option value="employees">Mitarbeiter/in</option>
    </select>

    <button onclick="updateChart()" class="btn btn-primary">Berechnen</button>
</div>

<div class="chart-container" aria-hidden="true">
    <div class="chart-item">
        <canvas id="co2Chart" width="400" height="200"></canvas>
    </div>
    <div class="chart-item">
        <canvas id="modalSplitChart" width="400" height="200"></canvas>
    </div>
</div>

<div class="result-container">
    <div id="result"></div>
</div>
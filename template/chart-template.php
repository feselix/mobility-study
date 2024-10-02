<?php

defined('ABSPATH') or die('Direct script access disallowed.');

// Assuming your text domain is 'mobility-study'
load_plugin_textdomain('mobility-study', false, basename(dirname(__FILE__)) . '/languages');

?>
<h3><?php _e('FAU CO₂ Emissions Calculator', 'mobility-study'); ?></h3>
<p><?php _e('Determine your current CO₂ emissions, discover savings through alternative means of transport, and see how you compare to others.', 'mobility-study'); ?></p>
<div class="input-container">
    <label for="distance"><?php _e('My route to FAU in km:', 'mobility-study'); ?></label>
    <input type="number" id="distance" step="0.1" class="form-control mb-2" placeholder="<?php echo esc_attr__('e.g., 4.5', 'mobility-study'); ?>" aria-required="true">

    <label for="frequency"><?php _e('Trips per week:', 'mobility-study'); ?></label>
    <input type="number" id="frequency" min="1" max="7" class="form-control mb-2" placeholder="<?php echo esc_attr__('e.g., 5', 'mobility-study'); ?>" aria-required="true">

    <label for="transport"><?php _e('Mode of transport:', 'mobility-study'); ?></label>
    <select id="transport" class="form-select mb-2" aria-required="true">
        <option value="" disabled selected><?php _e('Choose mode of transport', 'mobility-study'); ?></option>
        <option value="foot"><?php _e('On foot', 'mobility-study'); ?></option>
        <option value="bike"><?php _e('Bicycle / E-bike / E-scooter / Pedelec', 'mobility-study'); ?></option>
        <option value="opnv"><?php _e('Public Transport', 'mobility-study'); ?></option>
        <option value="miv"><?php _e('Car', 'mobility-study'); ?></option>
    </select>

    <label for="userType"><?php _e('I am:', 'mobility-study'); ?></label>
    <select id="userType" class="form-select mb-2" aria-required="true">
        <option value="" disabled selected><?php _e('Select', 'mobility-study'); ?></option>
        <option value="students"><?php _e('Student', 'mobility-study'); ?></option>
        <option value="employees"><?php _e('Employee', 'mobility-study'); ?></option>
    </select>

    <button onclick="updateChart()" class="btn btn-primary"><?php _e('Calculate', 'mobility-study'); ?></button>
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
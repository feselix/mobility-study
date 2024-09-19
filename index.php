<?php
/*
Plugin Name:  Mobility  Map Plugin (Supported by Open Street Map)
Description: Provides a map display with a dynamic sidebar and CO2 calculator. For support, email  at: felix.beck@iqonic.de
Version: 1.0
Author: Felix Back
*/

defined('ABSPATH') or die('Direct script access disallowed.');

function mobility_map_enqueue_scripts()
{
	global $post;  // Access the global $post variable to check the content of the current page or post.
	if (is_a($post, 'WP_Post')) {
		$uses_shortcode = has_shortcode($post->post_content, 'mobility_map');

		// Parse blocks and check for block usage
		$blocks = parse_blocks($post->post_content);
		$uses_block = false;

		foreach ($blocks as $block) {
			if ($block['blockName'] === 'mobility-map/map-block') {
				$uses_block = true;
				break;
			}
		}

		// Enqueue scripts and styles if either shortcode or block is used
		if ($uses_shortcode || $uses_block) {
			wp_enqueue_style('map-css', plugins_url('/assets/css/style.css', __FILE__), [], '1.0.0');
			wp_enqueue_style('leaflet-css', 'https://karte.fau.de/assets/v1/leaflet/leaflet.css', [], '1.0.0', 'screen,print');
			wp_enqueue_style('font-awesome-css', 'https://karte.fau.de/assets/v1/font-awesome/css/font-awesome.min.css', [], '1.0.0', 'screen,print');
			wp_enqueue_style('awesome-markers-css', 'https://karte.fau.de/assets/v1/leaflet.awesome-markers-fau/leaflet.awesome-markers-fau.css', [], '1.0.0', 'screen,print');
			wp_enqueue_style('loading-css', 'https://karte.fau.de/assets/v1/leaflet.loading/Control.Loading.css', [], '1.0.0', 'screen,print');


			wp_enqueue_script('leaflet-js', 'https://karte.fau.de/assets/v1/leaflet/leaflet.js', [], '1.0.0', true);
			wp_enqueue_script('leaflet-providers-js', 'https://karte.fau.de/assets/v1/leaflet.providers/leaflet.providers.js', ['leaflet-js'], '1.0.0', true);
			wp_enqueue_script('leaflet-awesome-markers-js', 'https://karte.fau.de/assets/v1/leaflet.awesome-markers/leaflet.awesome-markers.min.js', ['leaflet-js'], '1.0.0', true);
			wp_enqueue_script('leaflet-ajax-js', 'https://karte.fau.de/assets/v1/leaflet.ajax/leaflet.ajax.min.js', ['leaflet-js'], '1.0.0', true);
			wp_enqueue_script('leaflet-hash-js', 'https://karte.fau.de/assets/v1/leaflet.hash/leaflet-hash.js', ['leaflet-js'], '1.0.0', true);
			wp_enqueue_script('leaflet-loading-js', 'https://karte.fau.de/assets/v1/leaflet.loading/Control.Loading.js', ['leaflet-js'], '1.0.0', true);
			wp_enqueue_script('leaflet-sync-js', 'https://karte.fau.de/assets/v1/leaflet.sync/L.Map.Sync.js', ['leaflet-js'], '1.0.0', true);

			wp_enqueue_script('mobility-map-js', plugins_url('/assets/js/script.js', __FILE__), ['leaflet-js'], '1.0.0', true);

			$icons = [
				"default" => plugins_url('assets/icons/default.svg', __FILE__),
				"Fahrrad-Reparaturstation" => plugins_url('assets/icons/bike.svg', __FILE__),
				"Fahrradwerkstatt"         => plugins_url('assets/icons/bike-parking.svg', __FILE__),
				"VAG-Rad-Station"          => plugins_url('assets/icons/bicycle-station.svg', __FILE__),
				"Duschmoglichkeit"         => plugins_url('assets/icons/showers.svg', __FILE__),
				"Mobilpunkt"               => plugins_url('assets/icons/route.svg', __FILE__),
				"E-Ladesäule"              => plugins_url('assets/icons/charging-station.svg', __FILE__),
				"Car-Sharing"              => plugins_url('assets/icons/car-sharing.svg', __FILE__),
				"kostenfreie CityLinie"    => plugins_url('assets/icons/bus.svg', __FILE__),
				"kostenfreie CityLinie 299" => plugins_url('assets/icons/bus.svg', __FILE__),
				"Bushaltestelle"           => plugins_url('assets/icons/bus-stop.svg', __FILE__),
				"Bahnstation"              => plugins_url('assets/icons/train.svg', __FILE__),
				"E-Scooter Mobilpunkt"     => plugins_url('assets/icons/electric-scooter.svg', __FILE__)
			];

			wp_localize_script('mobility-map-js', 'mapMobilitytData', [
				'dataUrl' => plugins_url('/assets/js/data.json', __FILE__),
				'icons' => $icons
			]);
		}
	}
}

add_action('wp_enqueue_scripts', 'mobility_map_enqueue_scripts');






//////////////////////Chart  Enquueue Scripst////////////////////////////
//The enuqye will only be happend when block or shortcode will be used on any page
function co2_emissions_enqueue_scripts()
{
	global $post;
	if (is_a($post, 'WP_Post')) {
		$uses_shortcode = has_shortcode($post->post_content, 'co2_emissions_calculator');

		// Parse blocks and check for block usage
		$blocks = parse_blocks($post->post_content);
		$uses_block = false;

		foreach ($blocks as $block) {
			if ($block['blockName'] === 'mobility-map/co2-block') {
				$uses_block = true;
				break;
			}
		}

		// Enqueue scripts and styles if either shortcode or block is used
		if ($uses_shortcode || $uses_block) {

			wp_enqueue_style('co2-custom-css', plugins_url('/assets/css/style.css', __FILE__), [], '1.0.0');
			wp_enqueue_script('chart-js', plugins_url('/assets/js/chart.js', __FILE__), [], '1.0.0', true);
			wp_enqueue_script('chart-custom-js', plugins_url('/assets/js/custom-chart-js.js', __FILE__), ['chart-js'], '1.0.0', true);
		}
	}
}
add_action('wp_enqueue_scripts', 'co2_emissions_enqueue_scripts');

function mobility_map_register_block_assets()
{
	wp_register_script(
		'mobility-map-block-js',
		plugins_url('assets/js/block.js', __FILE__),
		array('wp-blocks', 'wp-element', 'wp-editor'),
		'1.0.0',
		true
	);

	wp_register_style(
		'mobility-map-block-css',
		plugins_url('assets/css/block-editor.css', __FILE__),
		array(),
		'1.0.0'
	);

	register_block_type('mobility-map/map-block', array(
		'editor_script' => 'mobility-map-block-js',
		'editor_style' => 'mobility-map-block-css',
		'render_callback' => 'mobility_map_render_map_block',
	));

	register_block_type('mobility-map/co2-block', array(
		'editor_script' => 'mobility-map-block-js',
		'editor_style' => 'mobility-map-block-css',
		'render_callback' => 'mobility_map_render_co2_block',
	));
}
add_action('init', 'mobility_map_register_block_assets');

// Render callback for Map block
function mobility_map_render_map_block($attributes, $content)
{
	ob_start();
	include(plugin_dir_path(__FILE__) . 'template/map-template.php');
	return ob_get_clean();
}

// Render callback for CO2 emissions block
function mobility_map_render_co2_block($attributes, $content)
{
	ob_start();
	include(plugin_dir_path(__FILE__) . 'template/chart-template.php');
	return ob_get_clean();
}

// Shortcode compatibility
function map_mobility_map_shortcode()
{
	return mobility_map_render_map_block([], '');
}
add_shortcode('mobility_map', 'map_mobility_map_shortcode');

function co2_emissions_calculator_shortcode()
{
	return mobility_map_render_co2_block([], '');
}
add_shortcode('co2_emissions_calculator', 'co2_emissions_calculator_shortcode');

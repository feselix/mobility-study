<?php
/*
Plugin Name:  Mobility  Map Plugin (Supported by Open Street Map)
Description: Provides a map display with a dynamic sidebar and CO2 calculator. For support, email  at: felix.beck@iqonic.de
Version: 1.0
Text Domain: mobility-study
Domain Path: /languages
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

			wp_enqueue_script('mobility-study-map', plugins_url('/assets/js/script.js', __FILE__), ['leaflet-js'], '1.0.0', true);

			$icons = [
				"default" => plugins_url('assets/icons/default.svg', __FILE__),
				"vag_rad_station" => plugins_url('assets/icons/bicycle-station.svg', __FILE__),
				"duschmoglichkeit" => plugins_url('assets/icons/showers.svg', __FILE__),
				"mobilpunkt" => plugins_url('assets/icons/route.svg', __FILE__),
				"e_ladesaule" => plugins_url('assets/icons/charging-station.svg', __FILE__),
				"car_sharing" => plugins_url('assets/icons/car-sharing.svg', __FILE__),
				"kostenfreie_citylinie_299" => plugins_url('assets/icons/bus.svg', __FILE__),
				"bushaltestelle" => plugins_url('assets/icons/bus-stop.svg', __FILE__),
				"fahrrad_reparaturstation" => plugins_url('assets/icons/repair.svg', __FILE__),  // Example: Assume you have an icon for this
				"fahrradwerkstatt" => plugins_url('assets/icons/tools.svg', __FILE__),
				"bahnstation" => plugins_url('assets/icons/train.svg', __FILE__),  // Example for train station
				"e_scooter_mobilpunkt" => plugins_url('assets/icons/electric-scooter.svg', __FILE__)  // E-scooter location
			];


			wp_localize_script('mobility-study-map', 'mapMobilityData', [
				'dataUrl' => plugins_url('/assets/js/data.json', __FILE__),
				//'categories' => $localized_categories,
				'icons' => $icons,
				'translations' => array(
					'category' => __('Category: ', 'mobility-study'),
					'address' => __('Address: ', 'mobility-study'),
					'onlyForMembers' => __('Only for FAU members', 'mobility-study'),
					'openStreetMap' => __('© OpenStreetMap', 'mobility-study'),
					'errorLoadingData' => __('Error loading the data: ', 'mobility-study'),
					'VAG-Rad-Station' => __('VAG Rad Station', 'mobility-study'),
					'Duschmoglichkeit' => __('Shower Facility', 'mobility-study'),
					'Mobilpunkt' => __('Mobility Point', 'mobility-study'),
					'E-Ladesaule' => __('Charging Station', 'mobility-study'),
					'Car-Sharing' => __('Car Sharing', 'mobility-study'),
					'kostenfreie CityLinie 299' => __('Free City Line 299', 'mobility-study'),
					'Bushaltestelle' => __('Bus Stop', 'mobility-study'),
					'Fahrrad-Reparaturstation' => __('Bicycle Repair Station', 'mobility-study'),
					'Fahrradwerkstatt' => __('Bicycle Workshop', 'mobility-study'),
					'Bahnstation' => __('Train Station', 'mobility-study')
				)
			]);
			//	die();
		}
	}
}

add_action('wp_enqueue_scripts', 'mobility_map_enqueue_scripts');






//////////////////////Chart  Enquueue Scripst////////////////////////////
//The enuqye will only be happend when block or shortcode will be used on any page
function mobility_map_co2_emissions_enqueue_scripts()
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
		if (is_a($post, 'WP_Post') && (has_shortcode($post->post_content, 'co2_emissions_calculator') || has_blocks('mobility-map/co2-block'))) {
			wp_enqueue_style('co2-custom-css', plugins_url('/assets/css/style.css', __FILE__), [], '1.0.0');
			wp_enqueue_script('chart-js', plugins_url('/assets/js/chart.js', __FILE__), [], '1.0.0', true);
			wp_enqueue_script('mobility-study-chart', plugins_url('/assets/js/custom-chart-js.js', __FILE__), ['chart-js'], '1.0.0', true);

			$chart_translations = array(
				'on_foot' => __('On foot', 'mobility-study'),
				'bicycle' => __('Bicycle', 'mobility-study'),
				'public_transport' => __('Public Transport', 'mobility-study'),
				'car' => __('Car', 'mobility-study'),
				'co2_emission' => __('CO₂ Emission', 'mobility-study'),
				'your_current_co2_emission' => __('Your current CO₂ emission', 'mobility-study'),
				'usage' => __('Usage (%)', 'mobility-study'),
				'modal_split_selected_distance' => __('Modal Split of the selected distance', 'mobility-study'),
				'share' => __('Share [%]', 'mobility-study'),
				'annual_co2_emission' => __('Your annual CO₂ emission is:', 'mobility-study'),
				'brief_analysis' => __('Brief Analysis:', 'mobility-study'),
				'uses' => __('uses', 'mobility-study'),
				'has_lowest_co2_with' => __('has the lowest CO₂ emission with', 'mobility-study'),
				'kg_per_year' => __('kg per year.', 'mobility-study'),
				'most_used_transport' => __('is the most used mode of transport.', 'mobility-study'),
				'could_save_you' => __('could save you', 'mobility-study'),
				'more_co2_per_year' => __('kg CO₂ more per year.', 'mobility-study'),
				'assumptions' => __('Assumptions:', 'mobility-study'),
				'could_save_you' => __('could save you', 'mobility-study'),
				'annual_co2_emissions' => __('Your annual CO₂ emissions are:', 'mobility-study'),
				'brief_analysis' => __('Brief Analysis:', 'mobility-study'),
				'uses' => __('uses', 'mobility-study'),
				'in_distance_category' => __('in their distance category.', 'mobility-study'),
				'has_lowest_co2_with' => __('has the lowest CO₂ emissions with', 'mobility-study'),
				'kg_per_year' => __('kg per year.', 'mobility-study'),
				'kg_CO2_per_year_could_be_saved' => __('kg CO₂ per year could be saved.', 'mobility-study'),
				'more_co2_per_year' => __('would cause you to emit kg CO₂ more per year.', 'mobility-study'),
				'valid_distance' => __('Please enter valid values ​​for distance and frequency.', 'mobility-study'),
				'most_used_transport' => __('is the most used mode of transport.', 'mobility-study'),
				'assumptions' => __('Assumptions:', 'mobility-study'),
				'modal_split_selected_distance' => __('Modal Split of the selected distance', 'mobility-study'),
				'share_percentage' => __('Share [%]', 'mobility-study'),
				'usage_percent' => __('Usage (%)', 'mobility-study'),
				'modal_split_selected_distance' => __('Modal Split of the selected distance', 'mobility-study'),
				'share_percentage' => __('Share [%]', 'mobility-study'),
				'your_current_co2_emission' => __('Your current CO₂ emission', 'mobility-study'),
				'current_co2_emission' => __('Your current CO₂ emission', 'mobility-study'),
				'your_co2_emission' => __('Your CO₂ emission', 'mobility-study'),
				'co2_equivalents' => __('CO₂ equivalents [kg/year]', 'mobility-study'),



				'average_weeks' => __('Due to lecture-free time or holidays and public holidays, we calculate an average of 43.5 weeks per year in which you travel to FAU.', 'mobility-study')
			);

			wp_localize_script('mobility-study-chart', 'chartTranslations', $chart_translations);
		}
	}
}
add_action('wp_enqueue_scripts', 'mobility_map_co2_emissions_enqueue_scripts');

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
function mobility_map_shortcode()
{
	return mobility_map_render_map_block([], '');
}
add_shortcode('mobility_map', 'mobility_map_shortcode');

function mobility_map_co2_emissions_calculator_shortcode()
{
	return mobility_map_render_co2_block([], '');
}
add_shortcode('co2_emissions_calculator', 'mobility_map_co2_emissions_calculator_shortcode');



function mobility_study_language_switcher_shortcode()
{
	// Capture the output of pll_the_languages to return it
	ob_start();
	pll_the_languages(array('dropdown' => 4)); // You can customize the parameters as needed
	return ob_get_clean();
}

// Register the shortcode with WordPress
add_shortcode('language_switcher', 'mobility_study_language_switcher_shortcode');


function mobility_study_load_textdomain()
{
	load_plugin_textdomain('mobility-study', false, dirname(plugin_basename(__FILE__)) . '/languages/');
}
add_action('init', 'mobility_study_load_textdomain');



// add_action('init', function () {
// 	$domain = 'mobility-study';
// 	$locale = apply_filters('plugin_locale', determine_locale(), $domain);
// 	$mofile = WP_PLUGIN_DIR . '/' . dirname(plugin_basename(__FILE__)) . '/languages/' . $domain . '-' . $locale . '.mo';

// 	echo '<br>Trying to load translation file: ' . $mofile;
// 	echo '<br>File exists: ' . (file_exists($mofile) ? 'Yes' : 'No');
// 	load_textdomain($domain, $mofile);
// 	echo _e('Category', 'mobility-study');
// });

<?php
/**
 * Plugin Name: wasm-encoder
 */

/**
 * Registers and enqueue the Editor scripts
 */
function wasm_editor_scripts() {
	$asset = include __DIR__ . '/build/wasm-encoder.asset.php';
	wp_enqueue_script( 'wasm-encoder-scripts', plugin_dir_url( __FILE__ ) . 'build/wasm-encoder.js', $asset['dependencies'] );
}
add_action( 'enqueue_block_editor_assets', 'wasm_editor_scripts' );

// Add HTTP Header
function shapeSpace_add_header() {
	if (is_admin()) header('Cross-Origin-Opener-Policy: same-origin');
	if (is_admin()) header('Cross-Origin-Embedder-Policy: require-corp');
}
add_action('admin_head', 'shapeSpace_add_header');

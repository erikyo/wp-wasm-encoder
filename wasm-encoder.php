<?php
/**
 * Plugin Name: wasm-encoder
 */

if ( ! defined( 'WASM_PLUGIN_DIR' ) ) {
	define( 'WASM_PLUGIN_DIR', dirname( __FILE__ ) );
}
if ( ! defined( 'WASM_PLUGIN_DIR_URL' ) ) {
	define( 'WASM_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );
}

/**
 * Adds the headers needed for ffmpeg-wasm to work because
 * SharedArrayBuffer is only available to pages that are cross-origin isolated
 *
 * @link https://developer.chrome.com/blog/enabling-shared-array-buffer/#cross-origin-isolation
 * @return void
 */
function wasm_add_header() {
	header( 'Cross-Origin-Opener-Policy: same-origin' );
	header( 'Cross-Origin-Embedder-Policy: require-corp' );
}
add_action( 'admin_init', 'wasm_add_header' );

include __DIR__ . '/inc/enqueue_scripts.php';
include __DIR__ . '/inc/rest-route.php';

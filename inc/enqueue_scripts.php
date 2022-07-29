<?php

/**
 * Registers and enqueue the Editor scripts
 */
function wasm_editor_scripts() {
	$asset = include WASM_PLUGIN_DIR . '/build/wasm-encoder.asset.php';
	wp_enqueue_script( 'wasm-encoder-scripts', WASM_PLUGIN_DIR_URL . 'build/wasm-encoder.js', $asset['dependencies'] );
	$title_nonce = wp_create_nonce( 'title_example' );
	wp_localize_script( 'wasm-encoder-scripts', 'wasmData', array(
			'nonce'    => $title_nonce,
		) );
}

add_action( 'enqueue_block_editor_assets', 'wasm_editor_scripts' );


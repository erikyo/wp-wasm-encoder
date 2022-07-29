<?php

/**
 * ajax Upload image
 */
function medialoader() {
	$file = $_POST['fileName'];

	$filename = $_POST['fileData'];

	$upload_dir = wp_upload_dir();

	$image_data = file_get_contents( $file );

	if ( wp_mkdir_p( $upload_dir['path'] ) ) {
		$file = $upload_dir['path'] . '/' . $filename;
	} else {
		$file = $upload_dir['basedir'] . '/' . $filename;
	}

	file_put_contents( $file, $image_data );

	$wp_filetype = wp_check_filetype( $filename, null );

	$attachment = array(
		'post_mime_type' => $wp_filetype['type'],
		'post_title' => sanitize_file_name( $filename ),
		'post_content' => '',
		'post_status' => 'inherit'
	);

	$attach_id = wp_insert_attachment( $attachment, $file );
	require_once( ABSPATH . 'wp-admin/includes/image.php' );
	$attach_data = wp_generate_attachment_metadata( $attach_id, $file );
	wp_update_attachment_metadata( $attach_id, $attach_data );

	wp_send_json_success( $attach_id );
}
add_action( 'wp_ajax_medialoader', 'medialoader' );
add_action( 'wp_ajax_nopriv_medialoader', 'medialoader' );

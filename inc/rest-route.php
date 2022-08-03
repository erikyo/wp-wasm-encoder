<?php

/* Registering the upload route for the REST API. */
add_action('rest_api_init', function (){
	//Register route
	register_rest_route( 'wp-wasm-encoder/v1' , '/upload/', [
		//Endpoint to update settings at
		[
			'methods' => ['GET'],
			'callback' => function(){
				return rest_ensure_response( [
					'rest-uploads' => [
						'enabled' => false,
					]
				], 200);
			},
			'permission_callback' => function(){
				return current_user_can('manage_options');
			}
		],
		[
			'methods' => ['POST'],
			'callback' => function($request){
				$params = $request->get_params();
				error_log($request);
				error_log($params);
				medialoader($params->fileData,$params->fileName);
				return rest_ensure_response(  ['success' => true], 200);
			},
			'permission_callback' => function(){
				return current_user_can('manage_options');
			}
		]
	]);
});

/**
 * Saves the file to the uploads directory and returns the attachment ID
 *
 * @param $file - The URL of the image you want to download.
 * @param $filename - The name of the file to be uploaded.
 *
 * @return int|WP_Error - The attachment ID of the image.
 */
function medialoader($file, $filename) {

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

	return $attach_id;
}

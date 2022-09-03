/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Plugin Dependencies
 */
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { availableFormats } from './data';

export let ffmpeg = false;
export let ffmpegLoaded = false;

/**
 * It fetches the file, transcodes it, and then sends it to the server
 *
 * @param  newEncode
 * @param  newEncode.target
 * @param  newEncode.data
 */
export const transcode = async ( { target, data } ) => {
	const typeData = availableFormats[ data ];

	/** Encoder vars */
	const message = document.getElementById( 'wp-wasm-message' );
	// we got the filepath, but we need only the filename and extension
	// 👇 assuming there are no slashes into filename
	const sourceFilenameExt = target.split( '/' ).pop();
	// 👇 assuming there are no other dots in the filename
	const sourceExtension = sourceFilenameExt.split( '.' ).pop();
	const sourceFilename = sourceFilenameExt.replace(
		'.' + sourceExtension,
		''
	);
	const newFilename = sourceFilename + '.' + typeData.extension;
	const newFileMime = typeData.type + '/' + typeData.extension;

	ffmpeg = createFFmpeg( { log: true } );

	// Endpoint URL
	const path = '/index.php?rest_route=/wp-wasm-encoder/v1/upload/';

	if ( ! ffmpeg ) {
		ffmpeg = createFFmpeg( {
			log: true,
			corePath: 'static/js/ffmpeg-core.js',
			progress: ( { ratio } ) => {
				message.innerHTML = `Complete: ${ ( ratio * 100.0 ).toFixed(
					2
				) }%`;
			},
		} );
	}

	message.innerHTML = 'Loading ffmpeg-core.js';

	fetch( target )
		.then( ( res ) => res.arrayBuffer() )
		.then( ( file ) => {
			return ffmpeg
				.load()
				.then( () => {
					ffmpegLoaded = true;
					return ffmpeg.FS(
						'writeFile',
						sourceFilenameExt,
						new Uint8Array( file, 0, file.byteLength )
					);
				} )
				.then( () => {
					message.innerHTML = 'Transcoding to ' + typeData.extension;
					return ffmpeg.run(
						'-i',
						sourceFilenameExt,
						...typeData.options,
						newFilename
					);
				} )
				.then( () => {
					message.innerHTML = 'Complete transcoding';
					const fileData = ffmpeg.FS( 'readFile', newFilename );

					// Prepare the file to be sent as a blob with the correct mime
					// const result = new window.Blob( [ fileData ], {
					// 	type: newFileMime,
					// } );

					// Post media via REST
					apiFetch( {
						path,
						headers: {
							'Content-Type': newFileMime,
							'Content-Title': newFilename,
							'Content-Disposition':
								'attachment; filename="' + newFilename + '"',
						},
						body: fileData,
						method: 'POST',
					} )
						.then( ( response ) => {
							// read data here
							message.innerHTML = JSON.stringify( response );
							console.log( response );
						} )
						.catch( ( err ) => {
							message.innerHTML = JSON.stringify( err );
							console.log( err );
						} );
				} );
		} );
};

/**
 * It cancels the current ffmpeg process
 */
export const cancel = () => {
	try {
		ffmpeg.exit();
	} catch ( e ) {
		throw new Error( e );
	}
	ffmpeg = null;
};

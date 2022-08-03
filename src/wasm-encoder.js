/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { Button, PanelBody, SelectControl } from '@wordpress/components';

// the available formats
export const formats = {
	mp4: 'mp4 (x264)',
	mp4x265: 'mp4 (x265)',
	webm: 'webm (libvpx)',
	ogv: 'ogv (theora)',
	mpeg1: 'mpeg-1 (native)',
	mpeg2: 'mpeg-2 (native)',
	av1: 'av1 (av1 codec)',
	avif: 'avif (av1 codec)',
	mp3: 'mp3 (lame)',
	aac: 'aac (fdk-aac)',
	wav: 'wav/wv (wavpack)',
	ogg: 'ogg (vorbis)',
	opus: 'opus (opus)',
	flac: 'flac (native)',
	gif: 'gif (native)',
	webp: 'webp (libwebp)',
};

// build the select content
const formatSelect = Object.entries( formats ).map( ( opt ) => {
	return {
		value: opt[ 0 ],
		label: opt[ 1 ],
	};
} );

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
export const wasmVideoEncoderTab = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const { name, attributes, isSelected } = props;
			const [ encoding, setEncoding ] = useState(
				formatSelect[ 0 ].value
			);

			let ffmpeg = null;

			const transcode = async ( { target, type } ) => {
				const ext = encoding;
				if ( ffmpeg === null ) {
					ffmpeg = createFFmpeg( {
						log: true,
						corePath:
							'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
						progress: ( { ratio } ) => {
							message.innerHTML = `Complete: ${ (
								ratio * 100.0
							).toFixed( 2 ) }%`;
						},
					} );
				}
				const message = document.getElementById( 'message' );
				const destination =
					type === 'video'
						? document.getElementById( 'output-video' )
						: document.getElementById( 'output-image' );
				const filenameExt = target.split( '/' ).pop();
				const extension = filenameExt.split( '.' ).pop();
				const filename = filenameExt.replace( '.' + extension, '' );

				message.innerHTML = 'Loading ffmpeg-core.js';

				fetch( target )
					.then( ( res ) => res.arrayBuffer() )
					.then( ( file ) => {
						ffmpeg
							.load()
							.then( () => {
								return ffmpeg.FS(
									'writeFile',
									filenameExt,
									new Uint8Array( file, 0, file.byteLength )
								);
							} )
							.then( () => {
								message.innerHTML = 'Transcoding to ' + ext;
								// ENCODING OPTIONS
								const options =
									ext === 'avif'
										? [ '-c:v', 'libaom-av1' ]
										: [];
								return ffmpeg.run(
									'-i',
									filenameExt,
									...options,
									filename + '.' + ext
								);
							} )
							.then( () => {
								message.innerHTML = 'Complete transcoding';
								const fileData = ffmpeg.FS(
									'readFile',
									filename + '.' + ext
								);
								//const result = URL.createObjectURL(
								//	new Blob( [ data.buffer ], {
								//		type: type + '/' + ext,
								//	} )
								//);
								//Endpoint URL
								const path =
									'/index.php?rest_route=/wp-wasm-encoder/v1/upload/';
								const data = JSON.stringify( {
									fileName: filename + '.' + ext,
									fileData,
								} );

								// Post media via REST
								apiFetch( {
									path,
									data,
									method: 'POST',
								} )
									.then( ( response ) => {
										// read data here
										message.innerHTML =
											JSON.stringify( response );
										console.log( response );
									} )
									.catch( ( err ) => {
										message.innerHTML =
											JSON.stringify( err );
										console.log( err );
									} );
							} );
					} );
			};

			const cancel = () => {
				try {
					ffmpeg.exit();
				} catch ( e ) {
					throw new Error( e );
				}
				ffmpeg = null;
			};

			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							initialOpen={ true }
							icon="visibility"
							title={ __( 'Wasm-encoder' ) }
						>
							<SelectControl
								value={ encoding }
								label={ __( 'Select target destination:' ) }
								onChange={ ( ev ) => {
									setEncoding( ev );
								} }
								options={ formatSelect }
							></SelectControl>
							{ isSelected && name === 'core/video' && (
								<>
									<h3>Encode to { encoding }</h3>
									<video
										id="output-video"
										src={ attributes.src }
										controls
									></video>
									<br />
									<Button
										variant={ 'primary' }
										onClick={ () =>
											transcode( {
												target: attributes.src,
												type: 'video',
												format: encoding,
											} )
										}
									>
										Encode
									</Button>
									<Button onClick={ cancel }>Cancel</Button>
									<p id="message"></p>
								</>
							) }
							{ isSelected && name === 'core/image' && (
								<>
									<h3>Image to mp4 (x264)</h3>
									<img
										id="output-image"
										src={ attributes.url }
									/>
									<br />
									<Button
										variant={ 'primary' }
										onClick={ () => {
											transcode( {
												target: attributes.url,
												type: 'image',
												format: encoding,
											} );
										} }
									>
										Encode
									</Button>
									<Button onClick={ cancel }>Cancel</Button>
									<p id="message"></p>
								</>
							) }
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
		};
	},
	'withAdvancedControls'
);

addFilter( 'editor.BlockEdit', 'codekraft/wasm-encoder', wasmVideoEncoderTab );

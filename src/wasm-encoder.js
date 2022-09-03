/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	CheckboxControl,
	PanelBody,
	SelectControl,
} from '@wordpress/components';

/**
 * Plugin Dependencies
 */
import { formatSelect, getType } from './data';
import { cancel, transcode } from './ffmpeg';

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
				formatSelect( getType( name ) )[ 0 ].value
			);

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
								options={ formatSelect( getType( name ) ) }
							></SelectControl>
							{ isSelected && (
								<>
									<h3>Image to Video</h3>
									{ getType( name ) === 'image' ? (
										<img
											id="output-image"
											src={ attributes.url }
											alt=""
										/>
									) : null }

									{ getType( name ) === 'video' ? (
										<video
											id="output-video"
											src={ attributes.src }
											controls
										/>
									) : null }

									{ getType( name ) === 'audio' ? (
										<audio
											id="output-video"
											src={ attributes.src }
											controls
										/>
									) : null }
									<br />
									<CheckboxControl></CheckboxControl>
									<Button
										variant={ 'primary' }
										onClick={ async () => {
											await transcode( {
												target:
													attributes.url ||
													attributes.src,
												data: encoding,
											} );
										} }
									>
										Encode
									</Button>
									<Button onClick={ cancel }>Cancel</Button>
									<p id="wp-wasm-message"></p>
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

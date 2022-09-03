// The available FFmpeg formats
// https://github.com/ffmpegwasm/ffmpeg.wasm-core#configuration
export const availableFormats = {
	mp4x264: {
		type: 'video',
		value: 'mp4x264',
		name: 'mp4 (x264)',
		extension: 'mp4',
		encodeTo: [],
		options: [],
	},
	mp4x265: {
		type: 'video',
		value: 'mp4x265',
		name: 'mp4 (x265)',
		extension: 'mp4',
		encodeTo: [],
		options: [],
	},
	webm: {
		type: 'video',
		value: 'webm',
		name: 'webm (libvpx)',
		extension: 'webm',
		encodeTo: [],
		options: [],
	},
	ogv: {
		type: 'video',
		value: 'ogv',
		name: 'ogv (theora)',
		extension: 'ogv',
		encodeTo: [],
		options: [],
	},
	av1: {
		type: 'video',
		value: 'aom',
		name: 'aom (mkv format, extremely slow takes over 120s for 1s video, not recommended to use)',
		extension: 'mkv',
		encodeTo: [],
		options: [],
	},
	mpeg1: {
		type: 'video',
		value: 'mpeg1',
		name: 'mpeg-1 (native)',
		extension: 'mpeg',
		encodeTo: [],
		options: [],
	},
	mpeg2: {
		type: 'video',
		value: 'mpeg2',
		name: 'mpeg-2 (native)',
		extension: 'mpeg',
		encodeTo: [],
		options: [],
	},

	mp3: {
		type: 'audio',
		value: 'mp3',
		name: 'mp3 (lame)',
		extension: 'mp3',
		encodeTo: [],
		options: [],
	},
	aac: {
		type: 'audio',
		value: 'aac',
		name: 'aac (fdk-aac)',
		extension: 'aac',
		encodeTo: [],
		options: [],
	},
	wav: {
		type: 'audio',
		value: 'wav',
		name: 'wav/wv (wavpack)',
		extension: 'wav',
		encodeTo: [],
		options: [],
	},
	ogg: {
		type: 'audio',
		value: 'ogg',
		name: 'ogg (vorbis)',
		extension: 'ogg',
		encodeTo: [],
		options: [],
	},
	opus: {
		type: 'audio',
		value: 'opus',
		name: 'opus (opus)',
		extension: 'opus',
		encodeTo: [],
		options: [],
	},
	flac: {
		type: 'audio',
		value: 'flac',
		name: 'flac (native)',
		extension: 'flac',
		encodeTo: [],
		options: [],
	},
	gif: {
		type: 'image',
		value: 'gif',
		name: 'gif (native)',
		extension: 'gif',
		encodeTo: [],
		options: [],
	},
	webp: {
		type: 'image',
		value: 'webp',
		name: 'webp (libwebp)',
		extension: 'webp',
		encodeTo: [],
		options: [],
	},
	avif: {
		type: 'image',
		value: 'avif',
		name: 'avif (av1 codec)',
		extension: 'avif',
		encodeTo: [],
		options: [ '-c:v', 'libaom-av1' ],
	},
};

/**
 * It takes a type as an argument and returns an array of objects with the name and label properties
 *
 * @param {string} type - The type of format you want to return.
 */
export const formatSelect = ( type ) => {
	const types = Object.values( availableFormats ).map( ( opt ) => {
		return opt.type === type
			? {
					extension: opt.extension,
					value: opt.value,
					label: opt.name,
			  }
			: null;
	} );
	return types.filter( Boolean );
};

/**
 * If the block name is 'core/image', return 'image',
 * if the block name is 'core/video', return 'video',
 * if the block name is 'core/audio', return 'audio',
 * otherwise return 'video'
 *
 * @param {string} blockName - The name of the block.
 *
 * @return {string} the type of media that is being used.
 */
export function getType( blockName ) {
	switch ( blockName ) {
		case 'core/image':
		case 'core/post-featured-image':
			return 'image';
		case 'core/video':
			return 'video';
		case 'core/audio':
			return 'audio';
		default:
			console.log( blockName );
			return 'video';
	}
}

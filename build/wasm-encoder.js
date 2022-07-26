/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@ffmpeg/ffmpeg/src/browser/defaultOptions.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/browser/defaultOptions.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../package.json */ "./node_modules/@ffmpeg/ffmpeg/package.json");


/*
 * Default options for browser environment
 */
const corePath = typeof process !== 'undefined' && "development" === 'development'
  ? new URL(/* asset import */ __webpack_require__(/*! ../../node_modules/@ffmpeg/core/dist/ffmpeg-core.js */ "./node_modules/@ffmpeg/core/dist/ffmpeg-core.js"), __webpack_require__.b).href
  : `https://unpkg.com/@ffmpeg/core@${_package_json__WEBPACK_IMPORTED_MODULE_0__.devDependencies["@ffmpeg/core"].substring(1)}/dist/ffmpeg-core.js`;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ corePath });


/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/browser/fetchFile.js":
/*!**************************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/browser/fetchFile.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchFile": () => (/* binding */ fetchFile)
/* harmony export */ });
const readFromBlobOrFile = (blob) => (
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
      reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
  })
);

// eslint-disable-next-line
const fetchFile = async (_data) => {
  let data = _data;
  if (typeof _data === 'undefined') {
    return new Uint8Array();
  }

  if (typeof _data === 'string') {
    /* From base64 format */
    if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(_data)) {
      data = atob(_data.split(',')[1])
        .split('')
        .map((c) => c.charCodeAt(0));
    /* From remote server/URL */
    } else {
      const res = await fetch(new URL(_data, "file:///D:/vvv-local/www/wordpress-one/public_html/wp-content/plugins/wp-wasm-encoder/node_modules/@ffmpeg/ffmpeg/src/browser/fetchFile.js").href);
      data = await res.arrayBuffer();
    }
  /* From Blob or File */
  } else if (_data instanceof File || _data instanceof Blob) {
    data = await readFromBlobOrFile(_data);
  }

  return new Uint8Array(data);
};


/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js":
/*!************************************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCreateFFmpegCore": () => (/* binding */ getCreateFFmpegCore)
/* harmony export */ });
/* harmony import */ var _utils_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/log */ "./node_modules/@ffmpeg/ffmpeg/src/utils/log.js");
/* harmony import */ var _utils_log__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils_log__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/errors */ "./node_modules/@ffmpeg/ffmpeg/src/utils/errors.js");
/* harmony import */ var _utils_errors__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_utils_errors__WEBPACK_IMPORTED_MODULE_1__);
/* eslint-disable no-undef */



/*
 * Fetch data from remote URL and convert to blob URL
 * to avoid CORS issue
 */
const toBlobURL = async (url, mimeType) => {
  (0,_utils_log__WEBPACK_IMPORTED_MODULE_0__.log)('info', `fetch ${url}`);
  const buf = await (await fetch(url)).arrayBuffer();
  (0,_utils_log__WEBPACK_IMPORTED_MODULE_0__.log)('info', `${url} file size = ${buf.byteLength} bytes`);
  const blob = new Blob([buf], { type: mimeType });
  const blobURL = URL.createObjectURL(blob);
  (0,_utils_log__WEBPACK_IMPORTED_MODULE_0__.log)('info', `${url} blob URL = ${blobURL}`);
  return blobURL;
};

// eslint-disable-next-line
const getCreateFFmpegCore = async ({
  corePath: _corePath,
  workerPath: _workerPath,
  wasmPath: _wasmPath,
}) => {
  // in Web Worker context
  // eslint-disable-next-line
  if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    if (typeof _corePath !== 'string') {
      throw Error('corePath should be a string!');
    }
    const coreRemotePath = new URL(_corePath, "file:///D:/vvv-local/www/wordpress-one/public_html/wp-content/plugins/wp-wasm-encoder/node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js").href;
    const corePath = await toBlobURL(
      coreRemotePath,
      'application/javascript',
    );
    const wasmPath = await toBlobURL(
      _wasmPath !== undefined ? _wasmPath : coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.wasm'),
      'application/wasm',
    );
    const workerPath = await toBlobURL(
      _workerPath !== undefined ? _workerPath : coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.worker.js'),
      'application/javascript',
    );
    if (typeof createFFmpegCore === 'undefined') {
      return new Promise((resolve) => {
        globalThis.importScripts(corePath);
        if (typeof createFFmpegCore === 'undefined') {
          throw Error((0,_utils_errors__WEBPACK_IMPORTED_MODULE_1__.CREATE_FFMPEG_CORE_IS_NOT_DEFINED)(coreRemotePath));
        }
        (0,_utils_log__WEBPACK_IMPORTED_MODULE_0__.log)('info', 'ffmpeg-core.js script loaded');
        resolve({
          createFFmpegCore,
          corePath,
          wasmPath,
          workerPath,
        });
      });
    }
    (0,_utils_log__WEBPACK_IMPORTED_MODULE_0__.log)('info', 'ffmpeg-core.js script is loaded already');
    return Promise.resolve({
      createFFmpegCore,
      corePath,
      wasmPath,
      workerPath,
    });
  }
  if (typeof _corePath !== 'string') {
    throw Error('corePath should be a string!');
  }
  const coreRemotePath = new URL(_corePath, "file:///D:/vvv-local/www/wordpress-one/public_html/wp-content/plugins/wp-wasm-encoder/node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js").href;
  const corePath = await toBlobURL(
    coreRemotePath,
    'application/javascript',
  );
  const wasmPath = await toBlobURL(
    coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.wasm'),
    'application/wasm',
  );
  const workerPath = await toBlobURL(
    coreRemotePath.replace('ffmpeg-core.js', 'ffmpeg-core.worker.js'),
    'application/javascript',
  );
  if (typeof createFFmpegCore === 'undefined') {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      const eventHandler = () => {
        script.removeEventListener('load', eventHandler);
        if (typeof createFFmpegCore === 'undefined') {
          throw Error((0,_utils_errors__WEBPACK_IMPORTED_MODULE_1__.CREATE_FFMPEG_CORE_IS_NOT_DEFINED)(coreRemotePath));
        }
        (0,_utils_log__WEBPACK_IMPORTED_MODULE_0__.log)('info', 'ffmpeg-core.js script loaded');
        resolve({
          createFFmpegCore,
          corePath,
          wasmPath,
          workerPath,
        });
      };
      script.src = corePath;
      script.type = 'text/javascript';
      script.addEventListener('load', eventHandler);
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }
  (0,_utils_log__WEBPACK_IMPORTED_MODULE_0__.log)('info', 'ffmpeg-core.js script is loaded already');
  return Promise.resolve({
    createFFmpegCore,
    corePath,
    wasmPath,
    workerPath,
  });
};


/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultOptions": () => (/* reexport safe */ _defaultOptions__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "fetchFile": () => (/* reexport safe */ _fetchFile__WEBPACK_IMPORTED_MODULE_2__.fetchFile),
/* harmony export */   "getCreateFFmpegCore": () => (/* reexport safe */ _getCreateFFmpegCore__WEBPACK_IMPORTED_MODULE_1__.getCreateFFmpegCore)
/* harmony export */ });
/* harmony import */ var _defaultOptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaultOptions */ "./node_modules/@ffmpeg/ffmpeg/src/browser/defaultOptions.js");
/* harmony import */ var _getCreateFFmpegCore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getCreateFFmpegCore */ "./node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js");
/* harmony import */ var _fetchFile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fetchFile */ "./node_modules/@ffmpeg/ffmpeg/src/browser/fetchFile.js");







/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/config.js":
/*!***************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/config.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = {
  defaultArgs: [
    /* args[0] is always the binary path */
    './ffmpeg',
    /* Disable interaction mode */
    '-nostdin',
    /* Force to override output file */
    '-y',
  ],
  baseOptions: {
    /* Flag to turn on/off log messages in console */
    log: false,
    /*
     * Custom logger to get ffmpeg.wasm output messages.
     * a sample logger looks like this:
     *
     * ```
     * logger = ({ type, message }) => {
     *   console.log(type, message);
     * }
     * ```
     *
     * type can be one of following:
     *
     * info: internal workflow debug messages
     * fferr: ffmpeg native stderr output
     * ffout: ffmpeg native stdout output
     */
    logger: () => {},
    /*
     * Progress handler to get current progress of ffmpeg command.
     * a sample progress handler looks like this:
     *
     * ```
     * progress = ({ ratio }) => {
     *   console.log(ratio);
     * }
     * ```
     *
     * ratio is a float number between 0 to 1.
     */
    progress: () => {},
    /*
     * Path to find/download ffmpeg.wasm-core,
     * this value should be overwriten by `defaultOptions` in
     * each environment.
     */
    corePath: '',
  },
};


/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/createFFmpeg.js":
/*!*********************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/createFFmpeg.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { defaultArgs, baseOptions } = __webpack_require__(/*! ./config */ "./node_modules/@ffmpeg/ffmpeg/src/config.js");
const parseArgs = __webpack_require__(/*! ./utils/parseArgs */ "./node_modules/@ffmpeg/ffmpeg/src/utils/parseArgs.js");
const { defaultOptions, getCreateFFmpegCore } = __webpack_require__(/*! ./node */ "./node_modules/@ffmpeg/ffmpeg/src/browser/index.js");
const { version } = __webpack_require__(/*! ../package.json */ "./node_modules/@ffmpeg/ffmpeg/package.json");

const NO_LOAD = Error('ffmpeg.wasm is not ready, make sure you have completed load().');

module.exports = (_options = {}) => {
  const {
    log: optLog,
    logger,
    progress: optProgress,
    ...options
  } = {
    ...baseOptions,
    ...defaultOptions,
    ..._options,
  };
  let Core = null;
  let ffmpeg = null;
  let runResolve = null;
  let runReject = null;
  let running = false;
  let customLogger = () => {};
  let logging = optLog;
  let progress = optProgress;
  let duration = 0;
  let frames = 0;
  let readFrames = false;
  let ratio = 0;

  const detectCompletion = (message) => {
    if (message === 'FFMPEG_END' && runResolve !== null) {
      runResolve();
      runResolve = null;
      runReject = null;
      running = false;
    }
  };
  const log = (type, message) => {
    customLogger({ type, message });
    if (logging) {
      console.log(`[${type}] ${message}`);
    }
  };
  const ts2sec = (ts) => {
    const [h, m, s] = ts.split(':');
    return (parseFloat(h) * 60 * 60) + (parseFloat(m) * 60) + parseFloat(s);
  };
  const parseProgress = (message, prog) => {
    if (typeof message === 'string') {
      if (message.startsWith('  Duration')) {
        const ts = message.split(', ')[0].split(': ')[1];
        const d = ts2sec(ts);
        prog({ duration: d, ratio });
        if (duration === 0 || duration > d) {
          duration = d;
          readFrames = true;
        }
      } else if (readFrames && message.startsWith('    Stream')) {
        const match = message.match(/([\d.]+) fps/);
        if (match) {
          const fps = parseFloat(match[1]);
          frames = duration * fps;
        } else {
          frames = 0;
        }
        readFrames = false;
      } else if (message.startsWith('frame') || message.startsWith('size')) {
        const ts = message.split('time=')[1].split(' ')[0];
        const t = ts2sec(ts);
        const match = message.match(/frame=\s*(\d+)/);
        if (frames && match) {
          const f = parseFloat(match[1]);
          ratio = Math.min(f / frames, 1);
        } else {
          ratio = t / duration;
        }
        prog({ ratio, time: t });
      } else if (message.startsWith('video:')) {
        prog({ ratio: 1 });
        duration = 0;
      }
    }
  };
  const parseMessage = ({ type, message }) => {
    log(type, message);
    parseProgress(message, progress);
    detectCompletion(message);
  };

  /*
   * Load ffmpeg.wasm-core script.
   * In browser environment, the ffmpeg.wasm-core script is fetch from
   * CDN and can be assign to a local path by assigning `corePath`.
   * In node environment, we use dynamic require and the default `corePath`
   * is `$ffmpeg/core`.
   *
   * Typically the load() func might take few seconds to minutes to complete,
   * better to do it as early as possible.
   *
   */
  const load = async () => {
    log('info', 'load ffmpeg-core');
    if (Core === null) {
      log('info', 'loading ffmpeg-core');
      /*
       * In node environment, all paths are undefined as there
       * is no need to set them.
       */
      const {
        createFFmpegCore,
        corePath,
        workerPath,
        wasmPath,
      } = await getCreateFFmpegCore(options);
      Core = await createFFmpegCore({
        /*
         * Assign mainScriptUrlOrBlob fixes chrome extension web worker issue
         * as there is no document.currentScript in the context of content_scripts
         */
        mainScriptUrlOrBlob: corePath,
        printErr: (message) => parseMessage({ type: 'fferr', message }),
        print: (message) => parseMessage({ type: 'ffout', message }),
        /*
         * locateFile overrides paths of files that is loaded by main script (ffmpeg-core.js).
         * It is critical for browser environment and we override both wasm and worker paths
         * as we are using blob URL instead of original URL to avoid cross origin issues.
         */
        locateFile: (path, prefix) => {
          if (typeof window !== 'undefined' || typeof WorkerGlobalScope !== 'undefined') {
            if (typeof wasmPath !== 'undefined'
              && path.endsWith('ffmpeg-core.wasm')) {
              return wasmPath;
            }
            if (typeof workerPath !== 'undefined'
              && path.endsWith('ffmpeg-core.worker.js')) {
              return workerPath;
            }
          }
          return prefix + path;
        },
      });
      ffmpeg = Core.cwrap(options.mainName || 'proxy_main', 'number', ['number', 'number']);
      log('info', 'ffmpeg-core loaded');
    } else {
      throw Error('ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.');
    }
  };

  /*
   * Determine whether the Core is loaded.
   */
  const isLoaded = () => Core !== null;

  /*
   * Run ffmpeg command.
   * This is the major function in ffmpeg.wasm, you can just imagine it
   * as ffmpeg native cli and what you need to pass is the same.
   *
   * For example, you can convert native command below:
   *
   * ```
   * $ ffmpeg -i video.avi -c:v libx264 video.mp4
   * ```
   *
   * To
   *
   * ```
   * await ffmpeg.run('-i', 'video.avi', '-c:v', 'libx264', 'video.mp4');
   * ```
   *
   */
  const run = (..._args) => {
    log('info', `run ffmpeg command: ${_args.join(' ')}`);
    if (Core === null) {
      throw NO_LOAD;
    } else if (running) {
      throw Error('ffmpeg.wasm can only run one command at a time');
    } else {
      running = true;
      return new Promise((resolve, reject) => {
        const args = [...defaultArgs, ..._args].filter((s) => s.length !== 0);
        runResolve = resolve;
        runReject = reject;
        ffmpeg(...parseArgs(Core, args));
      });
    }
  };

  /*
   * Run FS operations.
   * For input/output file of ffmpeg.wasm, it is required to save them to MEMFS
   * first so that ffmpeg.wasm is able to consume them. Here we rely on the FS
   * methods provided by Emscripten.
   *
   * Common methods to use are:
   * ffmpeg.FS('writeFile', 'video.avi', new Uint8Array(...)): writeFile writes
   * data to MEMFS. You need to use Uint8Array for binary data.
   * ffmpeg.FS('readFile', 'video.mp4'): readFile from MEMFS.
   * ffmpeg.FS('unlink', 'video.map'): delete file from MEMFS.
   *
   * For more info, check https://emscripten.org/docs/api_reference/Filesystem-API.html
   *
   */
  const FS = (method, ...args) => {
    log('info', `run FS.${method} ${args.map((arg) => (typeof arg === 'string' ? arg : `<${arg.length} bytes binary file>`)).join(' ')}`);
    if (Core === null) {
      throw NO_LOAD;
    } else {
      let ret = null;
      try {
        ret = Core.FS[method](...args);
      } catch (e) {
        if (method === 'readdir') {
          throw Error(`ffmpeg.FS('readdir', '${args[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`);
        } else if (method === 'readFile') {
          throw Error(`ffmpeg.FS('readFile', '${args[0]}') error. Check if the path exists`);
        } else {
          throw Error('Oops, something went wrong in FS operation.');
        }
      }
      return ret;
    }
  };

  /**
   * forcibly terminate the ffmpeg program.
   */
  const exit = () => {
    if (Core === null) {
      throw NO_LOAD;
    } else {
      // if there's any pending runs, reject them
      if (runReject) {
        runReject('ffmpeg has exited');
      }
      running = false;
      try {
        Core.exit(1);
      } catch (err) {
        log(err.message);
        if (runReject) {
          runReject(err);
        }
      } finally {
        Core = null;
        ffmpeg = null;
        runResolve = null;
        runReject = null;
      }
    }
  };

  const setProgress = (_progress) => {
    progress = _progress;
  };

  const setLogger = (_logger) => {
    customLogger = _logger;
  };

  const setLogging = (_logging) => {
    logging = _logging;
  };

  log('info', `use ffmpeg.wasm v${version}`);

  return {
    setProgress,
    setLogger,
    setLogging,
    load,
    isLoaded,
    run,
    exit,
    FS,
  };
};


/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
const createFFmpeg = __webpack_require__(/*! ./createFFmpeg */ "./node_modules/@ffmpeg/ffmpeg/src/createFFmpeg.js");
const { fetchFile } = __webpack_require__(/*! ./node */ "./node_modules/@ffmpeg/ffmpeg/src/browser/index.js");

module.exports = {
  /*
   * Create ffmpeg instance.
   * Each ffmpeg instance owns an isolated MEMFS and works
   * independently.
   *
   * For example:
   *
   * ```
   * const ffmpeg = createFFmpeg({
   *  log: true,
   *  logger: () => {},
   *  progress: () => {},
   *  corePath: '',
   * })
   * ```
   *
   * For the usage of these four arguments, check config.js
   *
   */
  createFFmpeg,
  /*
   * Helper function for fetching files from various resource.
   * Sometimes the video/audio file you want to process may located
   * in a remote URL and somewhere in your local file system.
   *
   * This helper function helps you to fetch to file and return an
   * Uint8Array variable for ffmpeg.wasm to consume.
   *
   */
  fetchFile,
};


/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/utils/errors.js":
/*!*********************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/utils/errors.js ***!
  \*********************************************************/
/***/ ((module) => {

const CREATE_FFMPEG_CORE_IS_NOT_DEFINED = (corePath) => (`
createFFmpegCore is not defined. ffmpeg.wasm is unable to find createFFmpegCore after loading ffmpeg-core.js from ${corePath}. Use another URL when calling createFFmpeg():

const ffmpeg = createFFmpeg({
  corePath: 'http://localhost:3000/ffmpeg-core.js',
});
`);

module.exports = {
  CREATE_FFMPEG_CORE_IS_NOT_DEFINED,
};


/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/utils/log.js":
/*!******************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/utils/log.js ***!
  \******************************************************/
/***/ ((module) => {

let logging = false;
let customLogger = () => {};

const setLogging = (_logging) => {
  logging = _logging;
};

const setCustomLogger = (logger) => {
  customLogger = logger;
};

const log = (type, message) => {
  customLogger({ type, message });
  if (logging) {
    console.log(`[${type}] ${message}`);
  }
};

module.exports = {
  logging,
  setLogging,
  setCustomLogger,
  log,
};


/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/src/utils/parseArgs.js":
/*!************************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/src/utils/parseArgs.js ***!
  \************************************************************/
/***/ ((module) => {

module.exports = (Core, args) => {
  const argsPtr = Core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
  args.forEach((s, idx) => {
    const sz = Core.lengthBytesUTF8(s) + 1;
    const buf = Core._malloc(sz);
    Core.stringToUTF8(s, buf, sz);
    Core.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');
  });
  return [args.length, argsPtr];
};


/***/ }),

/***/ "./src/data.js":
/*!*********************!*\
  !*** ./src/data.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "availableFormats": () => (/* binding */ availableFormats),
/* harmony export */   "formatSelect": () => (/* binding */ formatSelect),
/* harmony export */   "getType": () => (/* binding */ getType)
/* harmony export */ });
// The available FFmpeg formats
// https://github.com/ffmpegwasm/ffmpeg.wasm-core#configuration
const availableFormats = {
  mp4x264: {
    type: 'video',
    value: 'mp4x264',
    name: 'mp4 (x264)',
    extension: 'mp4',
    encodeTo: [],
    options: []
  },
  mp4x265: {
    type: 'video',
    value: 'mp4x265',
    name: 'mp4 (x265)',
    extension: 'mp4',
    encodeTo: [],
    options: []
  },
  webm: {
    type: 'video',
    value: 'webm',
    name: 'webm (libvpx)',
    extension: 'webm',
    encodeTo: [],
    options: []
  },
  ogv: {
    type: 'video',
    value: 'ogv',
    name: 'ogv (theora)',
    extension: 'ogv',
    encodeTo: [],
    options: []
  },
  av1: {
    type: 'video',
    value: 'aom',
    name: 'aom (mkv format, extremely slow takes over 120s for 1s video, not recommended to use)',
    extension: 'mkv',
    encodeTo: [],
    options: []
  },
  mpeg1: {
    type: 'video',
    value: 'mpeg1',
    name: 'mpeg-1 (native)',
    extension: 'mpeg',
    encodeTo: [],
    options: []
  },
  mpeg2: {
    type: 'video',
    value: 'mpeg2',
    name: 'mpeg-2 (native)',
    extension: 'mpeg',
    encodeTo: [],
    options: []
  },
  mp3: {
    type: 'audio',
    value: 'mp3',
    name: 'mp3 (lame)',
    extension: 'mp3',
    encodeTo: [],
    options: []
  },
  aac: {
    type: 'audio',
    value: 'aac',
    name: 'aac (fdk-aac)',
    extension: 'aac',
    encodeTo: [],
    options: []
  },
  wav: {
    type: 'audio',
    value: 'wav',
    name: 'wav/wv (wavpack)',
    extension: 'wav',
    encodeTo: [],
    options: []
  },
  ogg: {
    type: 'audio',
    value: 'ogg',
    name: 'ogg (vorbis)',
    extension: 'ogg',
    encodeTo: [],
    options: []
  },
  opus: {
    type: 'audio',
    value: 'opus',
    name: 'opus (opus)',
    extension: 'opus',
    encodeTo: [],
    options: []
  },
  flac: {
    type: 'audio',
    value: 'flac',
    name: 'flac (native)',
    extension: 'flac',
    encodeTo: [],
    options: []
  },
  gif: {
    type: 'image',
    value: 'gif',
    name: 'gif (native)',
    extension: 'gif',
    encodeTo: [],
    options: []
  },
  webp: {
    type: 'image',
    value: 'webp',
    name: 'webp (libwebp)',
    extension: 'webp',
    encodeTo: [],
    options: []
  },
  avif: {
    type: 'image',
    value: 'avif',
    name: 'avif (av1 codec)',
    extension: 'avif',
    encodeTo: [],
    options: ['-c:v', 'libaom-av1']
  }
};
/**
 * It takes a type as an argument and returns an array of objects with the name and label properties
 *
 * @param {string} type - The type of format you want to return.
 */

const formatSelect = type => {
  const types = Object.values(availableFormats).map(opt => {
    return opt.type === type ? {
      extension: opt.extension,
      value: opt.value,
      label: opt.name
    } : null;
  });
  return types.filter(Boolean);
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

function getType(blockName) {
  switch (blockName) {
    case 'core/image':
    case 'core/post-featured-image':
      return 'image';

    case 'core/video':
      return 'video';

    case 'core/audio':
      return 'audio';

    default:
      console.log(blockName);
      return 'video';
  }
}

/***/ }),

/***/ "./src/ffmpeg.js":
/*!***********************!*\
  !*** ./src/ffmpeg.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cancel": () => (/* binding */ cancel),
/* harmony export */   "ffmpeg": () => (/* binding */ ffmpeg),
/* harmony export */   "ffmpegLoaded": () => (/* binding */ ffmpegLoaded),
/* harmony export */   "transcode": () => (/* binding */ transcode)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ffmpeg/ffmpeg */ "./node_modules/@ffmpeg/ffmpeg/src/index.js");
/* harmony import */ var _ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./data */ "./src/data.js");
/**
 * WordPress Dependencies
 */

/**
 * Plugin Dependencies
 */



let ffmpeg = false;
let ffmpegLoaded = false;
/**
 * It fetches the file, transcodes it, and then sends it to the server
 *
 * @param  newEncode
 * @param  newEncode.target
 * @param  newEncode.data
 */

const transcode = async _ref => {
  let {
    target,
    data
  } = _ref;
  const typeData = _data__WEBPACK_IMPORTED_MODULE_2__.availableFormats[data];
  /** Encoder vars */

  const message = document.getElementById('wp-wasm-message'); // we got the filepath, but we need only the filename and extension
  // 👇 assuming there are no slashes into filename

  const sourceFilenameExt = target.split('/').pop(); // 👇 assuming there are no other dots in the filename

  const sourceExtension = sourceFilenameExt.split('.').pop();
  const sourceFilename = sourceFilenameExt.replace('.' + sourceExtension, '');
  const newFilename = sourceFilename + '.' + typeData.extension;
  const newFileMime = typeData.type + '/' + typeData.extension;
  ffmpeg = (0,_ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_1__.createFFmpeg)({
    log: true
  }); // Endpoint URL

  const path = '/index.php?rest_route=/wp-wasm-encoder/v1/upload/';

  if (!ffmpeg) {
    ffmpeg = (0,_ffmpeg_ffmpeg__WEBPACK_IMPORTED_MODULE_1__.createFFmpeg)({
      log: true,
      corePath: 'static/js/ffmpeg-core.js',
      progress: _ref2 => {
        let {
          ratio
        } = _ref2;
        message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
      }
    });
  }

  message.innerHTML = 'Loading ffmpeg-core.js';
  fetch(target).then(res => res.arrayBuffer()).then(file => {
    return ffmpeg.load().then(() => {
      ffmpegLoaded = true;
      return ffmpeg.FS('writeFile', sourceFilenameExt, new Uint8Array(file, 0, file.byteLength));
    }).then(() => {
      message.innerHTML = 'Transcoding to ' + typeData.extension;
      return ffmpeg.run('-i', sourceFilenameExt, ...typeData.options, newFilename);
    }).then(() => {
      message.innerHTML = 'Complete transcoding';
      const fileData = ffmpeg.FS('readFile', newFilename); // Prepare the file to be sent as a blob with the correct mime
      // const result = new window.Blob( [ fileData ], {
      // 	type: newFileMime,
      // } );
      // Post media via REST

      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
        path,
        headers: {
          'Content-Type': newFileMime,
          'Content-Title': newFilename,
          'Content-Disposition': 'attachment; filename="' + newFilename + '"'
        },
        body: fileData,
        method: 'POST'
      }).then(response => {
        // read data here
        message.innerHTML = JSON.stringify(response);
        console.log(response);
      }).catch(err => {
        message.innerHTML = JSON.stringify(err);
        console.log(err);
      });
    });
  });
};
/**
 * It cancels the current ffmpeg process
 */

const cancel = () => {
  try {
    ffmpeg.exit();
  } catch (e) {
    throw new Error(e);
  }

  ffmpeg = null;
};

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "./node_modules/@ffmpeg/core/dist/ffmpeg-core.js":
/*!*******************************************************!*\
  !*** ./node_modules/@ffmpeg/core/dist/ffmpeg-core.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2de34c4e54918508de9f.js";

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/@ffmpeg/ffmpeg/package.json":
/*!**************************************************!*\
  !*** ./node_modules/@ffmpeg/ffmpeg/package.json ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"_from":"@ffmpeg/ffmpeg@^0.11.4","_id":"@ffmpeg/ffmpeg@0.11.4","_inBundle":false,"_integrity":"sha512-uOr23vBp6/aslxR/+gyK6umxyDsGCy7ke1OuAPYi9MW1SgIBJDnE2ZwJW/zXAot0eZZQhtnWHQEDbdRCwSF7NA==","_location":"/@ffmpeg/ffmpeg","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"@ffmpeg/ffmpeg@^0.11.4","name":"@ffmpeg/ffmpeg","escapedName":"@ffmpeg%2fffmpeg","scope":"@ffmpeg","rawSpec":"^0.11.4","saveSpec":null,"fetchSpec":"^0.11.4"},"_requiredBy":["#DEV:/"],"_resolved":"https://registry.npmjs.org/@ffmpeg/ffmpeg/-/ffmpeg-0.11.4.tgz","_shasum":"faf3c68af0f73cbd79178afa0286187c0f2d0013","_spec":"@ffmpeg/ffmpeg@^0.11.4","_where":"D:\\\\vvv-local\\\\www\\\\wordpress-one\\\\public_html\\\\wp-content\\\\plugins\\\\wp-wasm-encoder","author":{"name":"Jerome Wu","email":"jeromewus@gmail.com"},"browser":{"./src/node/index.js":"./src/browser/index.js"},"bugs":{"url":"https://github.com/ffmpegwasm/ffmpeg.wasm/issues"},"bundleDependencies":false,"dependencies":{"is-url":"^1.2.4","node-fetch":"^2.6.1","regenerator-runtime":"^0.13.7","resolve-url":"^0.2.1"},"deprecated":false,"description":"FFmpeg WebAssembly version","devDependencies":{"@babel/core":"^7.12.3","@babel/preset-env":"^7.12.1","@ffmpeg/core":"^0.11.0","@types/emscripten":"^1.39.4","babel-eslint":"^10.1.0","babel-loader":"^8.1.0","chai":"^4.2.0","cors":"^2.8.5","eslint":"^7.12.1","eslint-config-airbnb-base":"^14.1.0","eslint-plugin-import":"^2.22.1","express":"^4.17.1","mocha":"^8.2.1","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","wait-on":"^5.3.0","webpack":"^5.3.2","webpack-cli":"^4.1.0","webpack-dev-middleware":"^4.0.0"},"directories":{"example":"examples"},"engines":{"node":">=12.16.1"},"homepage":"https://github.com/ffmpegwasm/ffmpeg.wasm#readme","keywords":["ffmpeg","WebAssembly","video"],"license":"MIT","main":"src/index.js","name":"@ffmpeg/ffmpeg","repository":{"type":"git","url":"git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"},"scripts":{"build":"rimraf dist && webpack --config scripts/webpack.config.prod.js","build:worker":"rimraf dist && webpack --config scripts/webpack.config.worker.prod.js","lint":"eslint src","prepublishOnly":"npm run build","start":"node scripts/server.js","start:worker":"node scripts/worker-server.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:ffmpeg test:node:all","test:browser":"mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:ffmpeg":"npm run test:browser -- -f ./tests/ffmpeg.test.html","test:node":"node node_modules/mocha/bin/_mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","wait":"rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js"},"types":"src/index.d.ts","version":"0.11.4"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"wasm-encoder": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./src/wasm-encoder.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "wasmVideoEncoderTab": () => (/* binding */ wasmVideoEncoderTab)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./data */ "./src/data.js");
/* harmony import */ var _ffmpeg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ffmpeg */ "./src/ffmpeg.js");


/**
 * WordPress Dependencies
 */






/**
 * Plugin Dependencies
 */



/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */

const wasmVideoEncoderTab = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    const {
      name,
      attributes,
      isSelected
    } = props;
    const [encoding, setEncoding] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)((0,_data__WEBPACK_IMPORTED_MODULE_6__.formatSelect)((0,_data__WEBPACK_IMPORTED_MODULE_6__.getType)(name))[0].value);
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockEdit, props), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.PanelBody, {
      initialOpen: true,
      icon: "visibility",
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Wasm-encoder')
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.SelectControl, {
      value: encoding,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select target destination:'),
      onChange: ev => {
        setEncoding(ev);
      },
      options: (0,_data__WEBPACK_IMPORTED_MODULE_6__.formatSelect)((0,_data__WEBPACK_IMPORTED_MODULE_6__.getType)(name))
    }), isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "Image to Video"), (0,_data__WEBPACK_IMPORTED_MODULE_6__.getType)(name) === 'image' ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      id: "output-image",
      src: attributes.url,
      alt: ""
    }) : null, (0,_data__WEBPACK_IMPORTED_MODULE_6__.getType)(name) === 'video' ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
      id: "output-video",
      src: attributes.src,
      controls: true
    }) : null, (0,_data__WEBPACK_IMPORTED_MODULE_6__.getType)(name) === 'audio' ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("audio", {
      id: "output-video",
      src: attributes.src,
      controls: true
    }) : null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.CheckboxControl, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
      variant: 'primary',
      onClick: async () => {
        await (0,_ffmpeg__WEBPACK_IMPORTED_MODULE_7__.transcode)({
          target: attributes.url || attributes.src,
          data: encoding
        });
      }
    }, "Encode"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Button, {
      onClick: _ffmpeg__WEBPACK_IMPORTED_MODULE_7__.cancel
    }, "Cancel"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      id: "wp-wasm-message"
    })))));
  };
}, 'withAdvancedControls');
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('editor.BlockEdit', 'codekraft/wasm-encoder', wasmVideoEncoderTab);
})();

/******/ })()
;
//# sourceMappingURL=wasm-encoder.js.map
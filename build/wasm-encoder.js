(()=>{var e={76:(e,t,r)=>{r(72);const{devDependencies:n}=r(681);e.exports={corePath:`https://unpkg.com/@ffmpeg/core@${n["@ffmpeg/core"].substring(1)}/dist/ffmpeg-core.js`}},339:(e,t,r)=>{const n=r(72);e.exports=async e=>{let t=e;if(void 0===e)return new Uint8Array;if("string"==typeof e)if(/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(e))t=atob(e.split(",")[1]).split("").map((e=>e.charCodeAt(0)));else{const r=await fetch(n(e));t=await r.arrayBuffer()}else(e instanceof File||e instanceof Blob)&&(t=await(r=e,new Promise(((e,t)=>{const n=new FileReader;n.onload=()=>{e(n.result)},n.onerror=({target:{error:{code:e}}})=>{t(Error(`File could not be read! Code=${e}`))},n.readAsArrayBuffer(r)}))));var r;return new Uint8Array(t)}},440:(e,t,r)=>{const n=r(72),{log:o}=r(888),i=async(e,t)=>{o("info",`fetch ${e}`);const r=await(await fetch(e)).arrayBuffer();o("info",`${e} file size = ${r.byteLength} bytes`);const n=new Blob([r],{type:t}),i=URL.createObjectURL(n);return o("info",`${e} blob URL = ${i}`),i};e.exports=async({corePath:e})=>{if("string"!=typeof e)throw Error("corePath should be a string!");const t=n(e),r=await i(t,"application/javascript"),a=await i(t.replace("ffmpeg-core.js","ffmpeg-core.wasm"),"application/wasm"),s=await i(t.replace("ffmpeg-core.js","ffmpeg-core.worker.js"),"application/javascript");return"undefined"==typeof createFFmpegCore?new Promise((e=>{const t=document.createElement("script"),n=()=>{t.removeEventListener("load",n),o("info","ffmpeg-core.js script loaded"),e({createFFmpegCore,corePath:r,wasmPath:a,workerPath:s})};t.src=r,t.type="text/javascript",t.addEventListener("load",n),document.getElementsByTagName("head")[0].appendChild(t)})):(o("info","ffmpeg-core.js script is loaded already"),Promise.resolve({createFFmpegCore,corePath:r,wasmPath:a,workerPath:s}))}},451:(e,t,r)=>{const n=r(76),o=r(440),i=r(339);e.exports={defaultOptions:n,getCreateFFmpegCore:o,fetchFile:i}},617:e=>{e.exports={defaultArgs:["./ffmpeg","-nostdin","-y"],baseOptions:{log:!1,logger:()=>{},progress:()=>{},corePath:""}}},648:(e,t,r)=>{const{defaultArgs:n,baseOptions:o}=r(617),{setLogging:i,setCustomLogger:a,log:s}=r(888),c=r(405),l=r(10),{defaultOptions:f,getCreateFFmpegCore:p}=r(451),{version:u}=r(681),m=Error("ffmpeg.wasm is not ready, make sure you have completed load().");e.exports=(e={})=>{const{log:t,logger:r,progress:h,...g}={...o,...f,...e};let d=null,w=null,y=null,v=!1,b=h;const E=({type:e,message:t})=>{s(e,t),c(t,b),(e=>{"FFMPEG_END"===e&&null!==y&&(y(),y=null,v=!1)})(t)};return i(t),a(r),s("info",`use ffmpeg.wasm v${u}`),{setProgress:e=>{b=e},setLogger:e=>{a(e)},setLogging:i,load:async()=>{if(s("info","load ffmpeg-core"),null!==d)throw Error("ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.");{s("info","loading ffmpeg-core");const{createFFmpegCore:e,corePath:t,workerPath:r,wasmPath:n}=await p(g);d=await e({mainScriptUrlOrBlob:t,printErr:e=>E({type:"fferr",message:e}),print:e=>E({type:"ffout",message:e}),locateFile:(e,t)=>{if("undefined"!=typeof window){if(void 0!==n&&e.endsWith("ffmpeg-core.wasm"))return n;if(void 0!==r&&e.endsWith("ffmpeg-core.worker.js"))return r}return t+e}}),w=d.cwrap("proxy_main","number",["number","number"]),s("info","ffmpeg-core loaded")}},isLoaded:()=>null!==d,run:(...e)=>{if(s("info",`run ffmpeg command: ${e.join(" ")}`),null===d)throw m;if(v)throw Error("ffmpeg.wasm can only run one command at a time");return v=!0,new Promise((t=>{const r=[...n,...e].filter((e=>0!==e.length));y=t,w(...l(d,r))}))},exit:()=>{if(null===d)throw m;v=!1,d.exit(1),d=null,w=null,y=null},FS:(e,...t)=>{if(s("info",`run FS.${e} ${t.map((e=>"string"==typeof e?e:`<${e.length} bytes binary file>`)).join(" ")}`),null===d)throw m;{let r=null;try{r=d.FS[e](...t)}catch(r){throw"readdir"===e?Error(`ffmpeg.FS('readdir', '${t[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`):"readFile"===e?Error(`ffmpeg.FS('readFile', '${t[0]}') error. Check if the path exists`):Error("Oops, something went wrong in FS operation.")}return r}}}}},45:(e,t,r)=>{r(666);const n=r(648),{fetchFile:o}=r(451);e.exports={createFFmpeg:n,fetchFile:o}},888:e=>{let t=!1,r=()=>{};e.exports={logging:t,setLogging:e=>{t=e},setCustomLogger:e=>{r=e},log:(e,n)=>{r({type:e,message:n}),t&&console.log(`[${e}] ${n}`)}}},10:e=>{e.exports=(e,t)=>{const r=e._malloc(t.length*Uint32Array.BYTES_PER_ELEMENT);return t.forEach(((t,n)=>{const o=e._malloc(t.length+1);e.writeAsciiToMemory(t,o),e.setValue(r+Uint32Array.BYTES_PER_ELEMENT*n,o,"i32")})),[t.length,r]}},405:e=>{let t=0,r=0;const n=e=>{const[t,r,n]=e.split(":");return 60*parseFloat(t)*60+60*parseFloat(r)+parseFloat(n)};e.exports=(e,o)=>{if("string"==typeof e)if(e.startsWith("  Duration")){const i=e.split(", ")[0].split(": ")[1],a=n(i);o({duration:a,ratio:r}),(0===t||t>a)&&(t=a)}else if(e.startsWith("frame")||e.startsWith("size")){const i=e.split("time=")[1].split(" ")[0],a=n(i);r=a/t,o({ratio:r,time:a})}else e.startsWith("video:")&&(o({ratio:1}),t=0)}},666:e=>{var t=function(e){"use strict";var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag";function c(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(e){c=function(e,t,r){return e[t]=r}}function l(e,t,r,n){var o=t&&t.prototype instanceof d?t:d,i=Object.create(o.prototype),a=new P(n||[]);return i._invoke=function(e,t,r){var n=p;return function(o,i){if(n===m)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw i;return S()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var s=_(a,r);if(s){if(s===g)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===p)throw n=h,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=m;var c=f(e,t,r);if("normal"===c.type){if(n=r.done?h:u,c.arg===g)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n=h,r.method="throw",r.arg=c.arg)}}}(e,r,a),i}function f(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=l;var p="suspendedStart",u="suspendedYield",m="executing",h="completed",g={};function d(){}function w(){}function y(){}var v={};c(v,i,(function(){return this}));var b=Object.getPrototypeOf,E=b&&b(b(C([])));E&&E!==r&&n.call(E,i)&&(v=E);var x=y.prototype=d.prototype=Object.create(v);function F(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function L(e,t){function r(o,i,a,s){var c=f(e[o],e,i);if("throw"!==c.type){var l=c.arg,p=l.value;return p&&"object"==typeof p&&n.call(p,"__await")?t.resolve(p.__await).then((function(e){r("next",e,a,s)}),(function(e){r("throw",e,a,s)})):t.resolve(p).then((function(e){l.value=e,a(l)}),(function(e){return r("throw",e,a,s)}))}s(c.arg)}var o;this._invoke=function(e,n){function i(){return new t((function(t,o){r(e,n,t,o)}))}return o=o?o.then(i,i):i()}}function _(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method))return g;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return g}var o=f(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,g;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function j(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function k(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function P(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(j,this),this.reset(!0)}function C(e){if(e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}return{next:S}}function S(){return{value:t,done:!0}}return w.prototype=y,c(x,"constructor",y),c(y,"constructor",w),w.displayName=c(y,s,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,y):(e.__proto__=y,c(e,s,"GeneratorFunction")),e.prototype=Object.create(x),e},e.awrap=function(e){return{__await:e}},F(L.prototype),c(L.prototype,a,(function(){return this})),e.AsyncIterator=L,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new L(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},F(x),c(x,s,"Generator"),c(x,i,(function(){return this})),c(x,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=C,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(k),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return s.type="throw",s.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],s=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),k(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;k(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:C(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}},72:function(e,t,r){var n,o;n=function(){return function(){var e=arguments.length;if(0===e)throw new Error("resolveUrl requires at least one argument; got none.");var t=document.createElement("base");if(t.href=arguments[0],1===e)return t.href;var r=document.getElementsByTagName("head")[0];r.insertBefore(t,r.firstChild);for(var n,o=document.createElement("a"),i=1;i<e;i++)o.href=arguments[i],n=o.href,t.href=n;return r.removeChild(t),n}},void 0===(o=n.call(t,r,t,e))||(e.exports=o)},681:e=>{"use strict";e.exports=JSON.parse('{"_args":[["@ffmpeg/ffmpeg@0.10.1","D:\\\\vvv-local\\\\www\\\\wordpress-one\\\\public_html\\\\wp-content\\\\plugins\\\\wp-wasm-encoder"]],"_development":true,"_from":"@ffmpeg/ffmpeg@0.10.1","_id":"@ffmpeg/ffmpeg@0.10.1","_inBundle":false,"_integrity":"sha512-ChQkH7Rh57hmVo1LhfQFibWX/xqneolJKSwItwZdKPcLZuKigtYAYDIvB55pDfP17VtR1R77SxgkB2/UApB+Og==","_location":"/@ffmpeg/ffmpeg","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"@ffmpeg/ffmpeg@0.10.1","name":"@ffmpeg/ffmpeg","escapedName":"@ffmpeg%2fffmpeg","scope":"@ffmpeg","rawSpec":"0.10.1","saveSpec":null,"fetchSpec":"0.10.1"},"_requiredBy":["#DEV:/"],"_resolved":"https://registry.npmjs.org/@ffmpeg/ffmpeg/-/ffmpeg-0.10.1.tgz","_spec":"0.10.1","_where":"D:\\\\vvv-local\\\\www\\\\wordpress-one\\\\public_html\\\\wp-content\\\\plugins\\\\wp-wasm-encoder","author":{"name":"Jerome Wu","email":"jeromewus@gmail.com"},"browser":{"./src/node/index.js":"./src/browser/index.js"},"bugs":{"url":"https://github.com/ffmpegwasm/ffmpeg.wasm/issues"},"dependencies":{"is-url":"^1.2.4","node-fetch":"^2.6.1","regenerator-runtime":"^0.13.7","resolve-url":"^0.2.1"},"description":"FFmpeg WebAssembly version","devDependencies":{"@babel/core":"^7.12.3","@babel/preset-env":"^7.12.1","@ffmpeg/core":"^0.10.0","@types/emscripten":"^1.39.4","babel-loader":"^8.1.0","chai":"^4.2.0","cors":"^2.8.5","eslint":"^7.12.1","eslint-config-airbnb-base":"^14.1.0","eslint-plugin-import":"^2.22.1","express":"^4.17.1","mocha":"^8.2.1","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","wait-on":"^5.3.0","webpack":"^5.3.2","webpack-cli":"^4.1.0","webpack-dev-middleware":"^4.0.0"},"directories":{"example":"examples"},"engines":{"node":">=12.16.1"},"homepage":"https://github.com/ffmpegwasm/ffmpeg.wasm#readme","keywords":["ffmpeg","WebAssembly","video"],"license":"MIT","main":"src/index.js","name":"@ffmpeg/ffmpeg","repository":{"type":"git","url":"git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"},"scripts":{"build":"rimraf dist && webpack --config scripts/webpack.config.prod.js","lint":"eslint src","prepublishOnly":"npm run build","start":"node scripts/server.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:ffmpeg test:node:all","test:browser":"mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:ffmpeg":"npm run test:browser -- -f ./tests/ffmpeg.test.html","test:node":"node --experimental-wasm-threads --experimental-wasm-bulk-memory node_modules/.bin/_mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","wait":"rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js"},"types":"src/index.d.ts","version":"0.10.1"}')}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,r),i.exports}(()=>{"use strict";const e=window.wp.element,t=window.wp.hooks,n=window.wp.i18n,o=window.wp.compose,i=window.wp.blockEditor;var a=r(45);const s=window.wp.components,c=(0,o.createHigherOrderComponent)((t=>r=>{const{name:o,attributes:c,setAttributes:l,isSelected:f}=r;let p=null;return(0,e.createElement)(e.Fragment,null,(0,e.createElement)(t,r),(0,e.createElement)(i.InspectorControls,null,(0,e.createElement)(s.PanelBody,{initialOpen:!0,icon:"visibility",title:(0,n.__)("Wasm-encoder")},f&&"core/video"===o&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)("h3",null,"Upload an avi video to transcode to mp4 (x264)!"),(0,e.createElement)("video",{id:"output-video",src:c.src,controls:!0}),(0,e.createElement)("br",null),(0,e.createElement)(s.Button,{variant:"primary",onClick:()=>(e=>{let{target:t}=e;null===p&&(p=(0,a.createFFmpeg)({log:!0,corePath:"https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"}));const r=document.getElementById("message"),n=document.getElementById("output-video");r.innerHTML="Loading ffmpeg-core.js",p.load().then((()=>p.FS("writeFile","video.mp4",(0,a.fetchFile)(t)))).then((()=>(r.innerHTML="Start transcoding",p.run("-i",o,"output.mp4")))).then((()=>{r.innerHTML="Complete transcoding";const e=p.FS("readFile","output.mp4");n.src=URL.createObjectURL(new Blob([e.buffer],{type:"video/mp4"}))}))})({target:c.src})}),(0,e.createElement)(s.Button,{onClick:()=>{try{p.exit()}catch(e){throw new Error(e)}p=null}},"Cancel"),(0,e.createElement)("p",{id:"message"})),f&&"core/image"===o&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)("p",null,"Imagemagick")))),(0,e.createElement)("script",null," if (!crossOriginIsolated) SharedArrayBuffer = ArrayBuffer; "))}),"withAdvancedControls");(0,t.addFilter)("editor.BlockEdit","codekraft/wasm-encoder",c)})()})();
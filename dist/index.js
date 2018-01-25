(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash"], factory);
	else if(typeof exports === 'object')
		exports["adease"] = factory(require("lodash"));
	else
		root["adease"] = factory(root["_"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var Adease_1 = __webpack_require__(1);
exports.Adease = Adease_1.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_1 = __webpack_require__(2);

var Adease = function () {
    function Adease() {
        _classCallCheck(this, Adease);

        this.sentBeacons = [];
    }
    /**
     * Downloads adease configuration from a URL, returning a promise
     * that resolves with undefined when done.
     * @param url string
     * @return Promise<void>
     */


    _createClass(Adease, [{
        key: "configureFromURL",
        value: function configureFromURL(url) {
            var _this = this;

            return fetch(url).then(function (res) {
                return res.json();
            }).then(Configuration_1.default.fromJSON).then(function (config) {
                return _this.config = config;
            }).then(function () {
                return undefined;
            });
        }
    }, {
        key: "getStreams",
        value: function getStreams() {
            this.ensureSetup();
            return this.config.getConfig().streams;
        }
        /**
         * Notify adease that a time update has occured. This may fire off beacons.
         * Returns a promise that resolves once all underlying actions have completed.
         */

    }, {
        key: "notifyTimeUpdate",
        value: function notifyTimeUpdate(time) {
            this.ensureSetup();
            return this.sendBeacons(time);
        }
        /**
         * @return A promise that resolves once all beacons are sent.
         */

    }, {
        key: "sendBeacons",
        value: function sendBeacons(time) {
            var _this2 = this;

            var ps = this.getAdsForTime(time).map(function (ad) {
                return ad.trackingUrls.filter(function (tURL) {
                    return tURL.kind === "impression";
                }).filter(function (tURL) {
                    return tURL.startTime < time;
                }).map(function (tURL) {
                    if (_this2.sentBeacons.includes(tURL)) {
                        return Promise.resolve();
                    }
                    _this2.sentBeacons.push(tURL);
                    return fetch(tURL.url);
                });
            });
            return Promise.all(ps).then(function () {
                return undefined;
            });
        }
    }, {
        key: "getAdsForTime",
        value: function getAdsForTime(time) {
            return this.config.getAdBreaks().filter(function (ad) {
                return ad.startTime <= time && ad.endTime >= time;
            });
        }
    }, {
        key: "ensureSetup",
        value: function ensureSetup() {
            if (!this.config) {
                throw "Adease not setup, but method called";
            }
        }
    }]);

    return Adease;
}();

exports.default = Adease;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(3);
/**
 * @internal
 */

var Configuration = function () {
    function Configuration(config) {
        _classCallCheck(this, Configuration);

        this.config = config;
    }

    _createClass(Configuration, [{
        key: "getAdBreaks",
        value: function getAdBreaks() {
            var _this = this;

            if (!this.config || !this.config.trackingURLs) {
                return [];
            }
            return this.config.trackingURLs.filter(function (tURL) {
                return tURL.kind === 'clickthrough';
            }).reduce(function (ads, tURL) {
                // Try to find an existing ad with this start time.
                if (ads.findIndex(function (ad) {
                    return ad.startTime === tURL.startTime;
                }) !== -1) {
                    return ads;
                }
                // Get the tracking URLs for this ad.
                var trackingURLs = _this.config.trackingURLs.filter(function (t) {
                    return t.adID === tURL.adID && t.startTime >= tURL.startTime && t.endTime <= tURL.endTime;
                });
                var ad = {
                    id: tURL.adID,
                    startTime: tURL.startTime,
                    endTime: tURL.endTime,
                    trackingUrls: trackingURLs
                };
                return ads.concat(ad);
            }, []);
        }
    }, {
        key: "getConfig",
        value: function getConfig() {
            return this.config;
        }
    }, {
        key: "getTrackingURLs",
        value: function getTrackingURLs() {
            return this.config.trackingURLs;
        }
    }], [{
        key: "fromJSON",
        value: function fromJSON(config) {
            var parsedConfiguration = Configuration.parseFromObject(config);
            if (parsedConfiguration === null) {
                throw "error parsing configuration";
            }
            return new Configuration(parsedConfiguration);
        }
    }, {
        key: "parseFromObject",
        value: function parseFromObject(json) {
            if (!(json && json.media && json.media.trackingUrls)) {
                return null;
            }
            return {
                trackingURLs: json.media.trackingUrls.map(function (obj) {
                    return {
                        url: obj.url,
                        startTime: _.toNumber(obj.starttime),
                        endTime: _.toNumber(obj.endtime),
                        kind: obj.event,
                        adID: obj.adID
                    };
                }),
                streams: json.media.renditions.map(function (obj) {
                    return {
                        url: obj.url
                    };
                })
            };
        }
    }]);

    return Configuration;
}();

exports.default = Configuration;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyM2Q2NDUxYzE0ZTI0Yzk1ZjYwOCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FkZWFzZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQ29uZmlndXJhdGlvbi50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImxvZGFzaFwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2hcIixcImFtZFwiOlwibG9kYXNoXCIsXCJyb290XCI6XCJfXCJ9Il0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiQWRlYXNlXzEiLCJyZXF1aXJlIiwiQWRlYXNlIiwiZGVmYXVsdCIsIkNvbmZpZ3VyYXRpb25fMSIsInNlbnRCZWFjb25zIiwidXJsIiwiZmV0Y2giLCJ0aGVuIiwicmVzIiwianNvbiIsImZyb21KU09OIiwiY29uZmlnIiwidW5kZWZpbmVkIiwiZW5zdXJlU2V0dXAiLCJnZXRDb25maWciLCJzdHJlYW1zIiwidGltZSIsInNlbmRCZWFjb25zIiwicHMiLCJnZXRBZHNGb3JUaW1lIiwibWFwIiwiYWQiLCJ0cmFja2luZ1VybHMiLCJmaWx0ZXIiLCJ0VVJMIiwia2luZCIsInN0YXJ0VGltZSIsImluY2x1ZGVzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJwdXNoIiwiYWxsIiwiZ2V0QWRCcmVha3MiLCJlbmRUaW1lIiwiXyIsIkNvbmZpZ3VyYXRpb24iLCJ0cmFja2luZ1VSTHMiLCJyZWR1Y2UiLCJhZHMiLCJmaW5kSW5kZXgiLCJ0IiwiYWRJRCIsImlkIiwiY29uY2F0IiwicGFyc2VkQ29uZmlndXJhdGlvbiIsInBhcnNlRnJvbU9iamVjdCIsIm1lZGlhIiwib2JqIiwidG9OdW1iZXIiLCJzdGFydHRpbWUiLCJlbmR0aW1lIiwiZXZl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SUFBSU47QUFMb0MscUJBQVI7QUFBQSxpQkFBNUIsQ0FEWDtBQVFIMUIseUJBQVNOLEtBQUtxQyxLQUFMLENBQVdNLFVBQVgsQ0FBc0JoQyxHQUF0QixDQUEwQjtBQUFBLDJCQUFRO0FBQ3ZDZiw2QkFBSzBDLElBQUkxQztBQUQ4QixxQkFBUjtBQUFBLGlCQUExQjtBQVJOLGFBQVA7QUFZSDs7Ozs7O0FBaUNMUixRQUFRSyxPQUFSLEdBQWtCaUMsYUFBbEIsQzs7Ozs7O0FDbEVBLCtDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwibG9kYXNoXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImxvZGFzaFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhZGVhc2VcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJsb2Rhc2hcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFkZWFzZVwiXSA9IGZhY3Rvcnkocm9vdFtcIl9cIl0pO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfM19fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDIzZDY0NTFjMTRlMjRjOTVmNjA4IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBZGVhc2VfMSA9IHJlcXVpcmUoXCIuL0FkZWFzZVwiKTtcbmV4cG9ydHMuQWRlYXNlID0gQWRlYXNlXzEuZGVmYXVsdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQ29uZmlndXJhdGlvbl8xID0gcmVxdWlyZShcIi4vQ29uZmlndXJhdGlvblwiKTtcbmNsYXNzIEFkZWFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc2VudEJlYWNvbnMgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRG93bmxvYWRzIGFkZWFzZSBjb25maWd1cmF0aW9uIGZyb20gYSBVUkwsIHJldHVybmluZyBhIHByb21pc2VcbiAgICAgKiB0aGF0IHJlc29sdmVzIHdpdGggdW5kZWZpbmVkIHdoZW4gZG9uZS5cbiAgICAgKiBAcGFyYW0gdXJsIHN0cmluZ1xuICAgICAqIEByZXR1cm4gUHJvbWlzZTx2b2lkPlxuICAgICAqL1xuICAgIGNvbmZpZ3VyZUZyb21VUkwodXJsKSB7XG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKENvbmZpZ3VyYXRpb25fMS5kZWZhdWx0LmZyb21KU09OKVxuICAgICAgICAgICAgLnRoZW4oY29uZmlnID0+ICh0aGlzLmNvbmZpZyA9IGNvbmZpZykpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICAgIH1cbiAgICBnZXRTdHJlYW1zKCkge1xuICAgICAgICB0aGlzLmVuc3VyZVNldHVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5nZXRDb25maWcoKS5zdHJlYW1zO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBOb3RpZnkgYWRlYXNlIHRoYXQgYSB0aW1lIHVwZGF0ZSBoYXMgb2NjdXJlZC4gVGhpcyBtYXkgZmlyZSBvZmYgYmVhY29ucy5cbiAgICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIHVuZGVybHlpbmcgYWN0aW9ucyBoYXZlIGNvbXBsZXRlZC5cbiAgICAgKi9cbiAgICBub3RpZnlUaW1lVXBkYXRlKHRpbWUpIHtcbiAgICAgICAgdGhpcy5lbnN1cmVTZXR1cCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5zZW5kQmVhY29ucyh0aW1lKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiBBIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBiZWFjb25zIGFyZSBzZW50LlxuICAgICAqL1xuICAgIHNlbmRCZWFjb25zKHRpbWUpIHtcbiAgICAgICAgY29uc3QgcHMgPSB0aGlzLmdldEFkc0ZvclRpbWUodGltZSlcbiAgICAgICAgICAgIC5tYXAoYWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFkLnRyYWNraW5nVXJsc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIodFVSTCA9PiB0VVJMLmtpbmQgPT09IFwiaW1wcmVzc2lvblwiKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIodFVSTCA9PiB0VVJMLnN0YXJ0VGltZSA8IHRpbWUpXG4gICAgICAgICAgICAgICAgLm1hcCh0VVJMID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZW50QmVhY29ucy5pbmNsdWRlcyh0VVJMKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VudEJlYWNvbnMucHVzaCh0VVJMKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2godFVSTC51cmwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHMpLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgZ2V0QWRzRm9yVGltZSh0aW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5nZXRBZEJyZWFrcygpLmZpbHRlcihhZCA9PiBhZC5zdGFydFRpbWUgPD0gdGltZSAmJiBhZC5lbmRUaW1lID49IHRpbWUpO1xuICAgIH1cbiAgICBlbnN1cmVTZXR1cCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZykge1xuICAgICAgICAgICAgdGhyb3cgXCJBZGVhc2Ugbm90IHNldHVwLCBidXQgbWV0aG9kIGNhbGxlZFwiO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQWRlYXNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0FkZWFzZS50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5jbGFzcyBDb25maWd1cmF0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tSlNPTihjb25maWcpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkQ29uZmlndXJhdGlvbiA9IENvbmZpZ3VyYXRpb24ucGFyc2VGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIGlmIChwYXJzZWRDb25maWd1cmF0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcImVycm9yIHBhcnNpbmcgY29uZmlndXJhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQ29uZmlndXJhdGlvbihwYXJzZWRDb25maWd1cmF0aW9uKTtcbiAgICB9XG4gICAgc3RhdGljIHBhcnNlRnJvbU9iamVjdChqc29uKSB7XG4gICAgICAgIGlmICghKGpzb24gJiYganNvbi5tZWRpYSAmJiBqc29uLm1lZGlhLnRyYWNraW5nVXJscykpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmFja2luZ1VSTHM6IGpzb24ubWVkaWEudHJhY2tpbmdVcmxzLm1hcChvYmogPT4gKHtcbiAgICAgICAgICAgICAgICB1cmw6IG9iai51cmwsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBfLnRvTnVtYmVyKG9iai5zdGFydHRpbWUpLFxuICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8udG9OdW1iZXIob2JqLmVuZHRpbWUpLFxuICAgICAgICAgICAgICAgIGtpbmQ6IG9iai5ldmVudCxcbiAgICAgICAgICAgICAgICBhZElEOiBvYmouYWRJRCxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHN0cmVhbXM6IGpzb24ubWVkaWEucmVuZGl0aW9ucy5tYXAob2JqID0+ICh7XG4gICAgICAgICAgICAgICAgdXJsOiBvYmoudXJsLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRBZEJyZWFrcygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZyB8fCAhdGhpcy5jb25maWcudHJhY2tpbmdVUkxzKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnRyYWNraW5nVVJMc1xuICAgICAgICAgICAgLmZpbHRlcih0VVJMID0+IHRVUkwua2luZCA9PT0gJ2NsaWNrdGhyb3VnaCcpXG4gICAgICAgICAgICAucmVkdWNlKChhZHMsIHRVUkwpID0+IHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIGFuIGV4aXN0aW5nIGFkIHdpdGggdGhpcyBzdGFydCB0aW1lLlxuICAgICAgICAgICAgaWYgKGFkcy5maW5kSW5kZXgoYWQgPT4gYWQuc3RhcnRUaW1lID09PSB0VVJMLnN0YXJ0VGltZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEdldCB0aGUgdHJhY2tpbmcgVVJMcyBmb3IgdGhpcyBhZC5cbiAgICAgICAgICAgIGNvbnN0IHRyYWNraW5nVVJMcyA9IHRoaXMuY29uZmlnLnRyYWNraW5nVVJMc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIodCA9PiB0LmFkSUQgPT09IHRVUkwuYWRJRFxuICAgICAgICAgICAgICAgICYmIHQuc3RhcnRUaW1lID49IHRVUkwuc3RhcnRUaW1lXG4gICAgICAgICAgICAgICAgJiYgdC5lbmRUaW1lIDw9IHRVUkwuZW5kVGltZSk7XG4gICAgICAgICAgICBjb25zdCBhZCA9IHtcbiAgICAgICAgICAgICAgICBpZDogdFVSTC5hZElELFxuICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogdFVSTC5zdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgZW5kVGltZTogdFVSTC5lbmRUaW1lLFxuICAgICAgICAgICAgICAgIHRyYWNraW5nVXJsczogdHJhY2tpbmdVUkxzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBhZHMuY29uY2F0KGFkKTtcbiAgICAgICAgfSwgW10pO1xuICAgIH1cbiAgICBnZXRDb25maWcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgICB9XG4gICAgZ2V0VHJhY2tpbmdVUkxzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcudHJhY2tpbmdVUkxzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENvbmZpZ3VyYXRpb247XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQ29uZmlndXJhdGlvbi50cyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImxvZGFzaFwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2hcIixcImFtZFwiOlwibG9kYXNoXCIsXCJyb290XCI6XCJfXCJ9XG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=
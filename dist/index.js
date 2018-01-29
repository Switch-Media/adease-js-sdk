(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["adease"] = factory();
	else
		root["adease"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
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
                        startTime: Number(obj.starttime),
                        endTime: Number(obj.endtime),
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

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map
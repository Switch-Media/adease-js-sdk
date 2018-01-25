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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxMzQ3YTllZDYwZDRhMzE0YjY5NiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FkZWFzZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQ29uZmlndXJhdGlvbi50cyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsIkFkZWFzZV8xIiwicmVxdWlyZSIsIkFkZWFzZSIsImRlZmF1bHQiLCJDb25maWd1cmF0aW9uXzEiLCJzZW50QmVhY29ucyIsInVybCIsImZldGNoIiwidGhlbiIsInJlcyIsImpzb24iLCJmcm9tSlNPTiIsImNvbmZpZyIsInVuZGVmaW5lZCIsImVuc3VyZVNldHVwIiwiZ2V0Q29uZmlnIiwic3RyZWFtcyIsInRpbWUiLCJzZW5kQmVhY29ucyIsInBzIiwiZ2V0QWRzRm9yVGltZSIsIm1hcCIsImFkIiwidHJhY2tpbmdVcmxzIiwiZmlsdGVyIiwidFVSTCIsImtpbmQiLCJzdGFydFRpbWUiLCJpbmNsdWRlcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicHVzaCIsImFsbCIsImdldEFkQnJlYWtzIiwiZW5kVGltZSIsIkNvbmZpZ3VyYXRpb24iLCJ0cmFja2luZ1VSTHMiLCJyZWR1Y2UiLCJhZHMiLCJmaW5kSW5kZXgiLCJ0IiwiYWRJRCIsImlkIiwiY29uY2F0IiwicGFyc2VkQ29uZmlndXJhdGlvbiIsInBhcnNlRnJvbU9iamVjdCIsIm1lZGlhIiwib2JqIiwiTnVtYmVyIiwic3RhcnR0aW1lIiwiZW5kdGltZSIsImV2ZW50IiwicmVuZGl0aW9ucyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7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LFFBQVFLLE9BQVIsR0FBa0JnQyxhQUFsQixDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYWRlYXNlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFkZWFzZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTM0N2E5ZWQ2MGQ0YTMxNGI2OTYiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFkZWFzZV8xID0gcmVxdWlyZShcIi4vQWRlYXNlXCIpO1xuZXhwb3J0cy5BZGVhc2UgPSBBZGVhc2VfMS5kZWZhdWx0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBDb25maWd1cmF0aW9uXzEgPSByZXF1aXJlKFwiLi9Db25maWd1cmF0aW9uXCIpO1xuY2xhc3MgQWRlYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZW50QmVhY29ucyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEb3dubG9hZHMgYWRlYXNlIGNvbmZpZ3VyYXRpb24gZnJvbSBhIFVSTCwgcmV0dXJuaW5nIGEgcHJvbWlzZVxuICAgICAqIHRoYXQgcmVzb2x2ZXMgd2l0aCB1bmRlZmluZWQgd2hlbiBkb25lLlxuICAgICAqIEBwYXJhbSB1cmwgc3RyaW5nXG4gICAgICogQHJldHVybiBQcm9taXNlPHZvaWQ+XG4gICAgICovXG4gICAgY29uZmlndXJlRnJvbVVSTCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oQ29uZmlndXJhdGlvbl8xLmRlZmF1bHQuZnJvbUpTT04pXG4gICAgICAgICAgICAudGhlbihjb25maWcgPT4gKHRoaXMuY29uZmlnID0gY29uZmlnKSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIGdldFN0cmVhbXMoKSB7XG4gICAgICAgIHRoaXMuZW5zdXJlU2V0dXAoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmdldENvbmZpZygpLnN0cmVhbXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE5vdGlmeSBhZGVhc2UgdGhhdCBhIHRpbWUgdXBkYXRlIGhhcyBvY2N1cmVkLiBUaGlzIG1heSBmaXJlIG9mZiBiZWFjb25zLlxuICAgICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgdW5kZXJseWluZyBhY3Rpb25zIGhhdmUgY29tcGxldGVkLlxuICAgICAqL1xuICAgIG5vdGlmeVRpbWVVcGRhdGUodGltZSkge1xuICAgICAgICB0aGlzLmVuc3VyZVNldHVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRCZWFjb25zKHRpbWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIGJlYWNvbnMgYXJlIHNlbnQuXG4gICAgICovXG4gICAgc2VuZEJlYWNvbnModGltZSkge1xuICAgICAgICBjb25zdCBwcyA9IHRoaXMuZ2V0QWRzRm9yVGltZSh0aW1lKVxuICAgICAgICAgICAgLm1hcChhZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWQudHJhY2tpbmdVcmxzXG4gICAgICAgICAgICAgICAgLmZpbHRlcih0VVJMID0+IHRVUkwua2luZCA9PT0gXCJpbXByZXNzaW9uXCIpXG4gICAgICAgICAgICAgICAgLmZpbHRlcih0VVJMID0+IHRVUkwuc3RhcnRUaW1lIDwgdGltZSlcbiAgICAgICAgICAgICAgICAubWFwKHRVUkwgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbnRCZWFjb25zLmluY2x1ZGVzKHRVUkwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZW50QmVhY29ucy5wdXNoKHRVUkwpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmZXRjaCh0VVJMLnVybCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcykudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICAgIH1cbiAgICBnZXRBZHNGb3JUaW1lKHRpbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmdldEFkQnJlYWtzKCkuZmlsdGVyKGFkID0+IGFkLnN0YXJ0VGltZSA8PSB0aW1lICYmIGFkLmVuZFRpbWUgPj0gdGltZSk7XG4gICAgfVxuICAgIGVuc3VyZVNldHVwKCkge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkFkZWFzZSBub3Qgc2V0dXAsIGJ1dCBtZXRob2QgY2FsbGVkXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBBZGVhc2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQWRlYXNlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5jbGFzcyBDb25maWd1cmF0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tSlNPTihjb25maWcpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkQ29uZmlndXJhdGlvbiA9IENvbmZpZ3VyYXRpb24ucGFyc2VGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIGlmIChwYXJzZWRDb25maWd1cmF0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcImVycm9yIHBhcnNpbmcgY29uZmlndXJhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQ29uZmlndXJhdGlvbihwYXJzZWRDb25maWd1cmF0aW9uKTtcbiAgICB9XG4gICAgc3RhdGljIHBhcnNlRnJvbU9iamVjdChqc29uKSB7XG4gICAgICAgIGlmICghKGpzb24gJiYganNvbi5tZWRpYSAmJiBqc29uLm1lZGlhLnRyYWNraW5nVXJscykpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmFja2luZ1VSTHM6IGpzb24ubWVkaWEudHJhY2tpbmdVcmxzLm1hcChvYmogPT4gKHtcbiAgICAgICAgICAgICAgICB1cmw6IG9iai51cmwsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBOdW1iZXIob2JqLnN0YXJ0dGltZSksXG4gICAgICAgICAgICAgICAgZW5kVGltZTogTnVtYmVyKG9iai5lbmR0aW1lKSxcbiAgICAgICAgICAgICAgICBraW5kOiBvYmouZXZlbnQsXG4gICAgICAgICAgICAgICAgYWRJRDogb2JqLmFkSUQsXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBzdHJlYW1zOiBqc29uLm1lZGlhLnJlbmRpdGlvbnMubWFwKG9iaiA9PiAoe1xuICAgICAgICAgICAgICAgIHVybDogb2JqLnVybCxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0QWRCcmVha3MoKSB7XG4gICAgICAgIGlmICghdGhpcy5jb25maWcgfHwgIXRoaXMuY29uZmlnLnRyYWNraW5nVVJMcykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy50cmFja2luZ1VSTHNcbiAgICAgICAgICAgIC5maWx0ZXIodFVSTCA9PiB0VVJMLmtpbmQgPT09ICdjbGlja3Rocm91Z2gnKVxuICAgICAgICAgICAgLnJlZHVjZSgoYWRzLCB0VVJMKSA9PiB7XG4gICAgICAgICAgICAvLyBUcnkgdG8gZmluZCBhbiBleGlzdGluZyBhZCB3aXRoIHRoaXMgc3RhcnQgdGltZS5cbiAgICAgICAgICAgIGlmIChhZHMuZmluZEluZGV4KGFkID0+IGFkLnN0YXJ0VGltZSA9PT0gdFVSTC5zdGFydFRpbWUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRyYWNraW5nIFVSTHMgZm9yIHRoaXMgYWQuXG4gICAgICAgICAgICBjb25zdCB0cmFja2luZ1VSTHMgPSB0aGlzLmNvbmZpZy50cmFja2luZ1VSTHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHQgPT4gdC5hZElEID09PSB0VVJMLmFkSURcbiAgICAgICAgICAgICAgICAmJiB0LnN0YXJ0VGltZSA+PSB0VVJMLnN0YXJ0VGltZVxuICAgICAgICAgICAgICAgICYmIHQuZW5kVGltZSA8PSB0VVJMLmVuZFRpbWUpO1xuICAgICAgICAgICAgY29uc3QgYWQgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IHRVUkwuYWRJRCxcbiAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHRVUkwuc3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgIGVuZFRpbWU6IHRVUkwuZW5kVGltZSxcbiAgICAgICAgICAgICAgICB0cmFja2luZ1VybHM6IHRyYWNraW5nVVJMcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gYWRzLmNvbmNhdChhZCk7XG4gICAgICAgIH0sIFtdKTtcbiAgICB9XG4gICAgZ2V0Q29uZmlnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gICAgfVxuICAgIGdldFRyYWNraW5nVVJMcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnRyYWNraW5nVVJMcztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb25maWd1cmF0aW9uO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbmZpZ3VyYXRpb24udHMiXSwic291cmNlUm9vdCI6IiJ9
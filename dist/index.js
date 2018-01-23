(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("axios"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "axios"], factory);
	else if(typeof exports === 'object')
		exports["adease"] = factory(require("lodash"), require("axios"));
	else
		root["adease"] = factory(root["_"], root["axios"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var Adease_1 = __webpack_require__(2);
exports.Adease = Adease_1.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __webpack_require__(3);
var _ = __webpack_require__(0);
var Configuration_1 = __webpack_require__(4);

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

            return axios_1.default.get(url).then(function (res) {
                return res.data;
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
                return _(ad.trackingUrls).filter(function (tURL) {
                    return tURL.kind === "impression";
                }).filter(function (tURL) {
                    return tURL.startTime < time;
                }).map(function (tURL) {
                    if (_.includes(_this2.sentBeacons, tURL)) {
                        return Promise.resolve();
                    }
                    _this2.sentBeacons.push(tURL);
                    return axios_1.default.get(tURL.url);
                }).value();
            }).value();
            return Promise.all(ps).then(function () {
                return undefined;
            });
        }
    }, {
        key: "getAdsForTime",
        value: function getAdsForTime(time) {
            return _(this.config.getAdBreaks()).filter(function (ad) {
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
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
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

            return _(this.config.trackingURLs).filter(function (tURL) {
                return tURL.kind === 'clickthrough';
            }).reduce(function (ads, tURL) {
                // Try to find an existing ad with this start time.
                if (_.findIndex(ads, function (ad) {
                    return ad.startTime === tURL.startTime;
                }) !== -1) {
                    return ads;
                }
                // Get the tracking URLs for this ad.
                var trackingURLs = _(_this.config.trackingURLs).filter(function (t) {
                    return t.adID === tURL.adID && t.startTime >= tURL.startTime && t.endTime <= tURL.endTime;
                }).value();
                var ad = {
                    id: tURL.adID,
                    startTime: tURL.startTime,
                    endTime: tURL.endTime,
                    trackingUrls: trackingURLs
                };
                return _.concat(ads, ad);
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

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzZTg0N2U4NDI2NjM3NmMxNzU2ZCIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImxvZGFzaFwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2hcIixcImFtZFwiOlwibG9kYXNoXCIsXCJyb290XCI6XCJfXCJ9Iiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQWRlYXNlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImF4aW9zXCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJBZGVhc2VfMSIsInJlcXVpcmUiLCJBZGVhc2UiLCJkZWZhdWx0IiwiYXhpb3NfMSIsIl8iLCJDb25maWd1cmF0aW9uXzEiLCJzZW50QmVhY29ucyIsInVybCIsImdldCIsInRoZW4iLCJyZXMiLCJkYXRhIiwiZnJvbUpTT04iLCJjb25maWciLCJ1bmRlZmluZWQiLCJlbnN1cmVTZXR1cCIsImdldENvbmZpZyIsInN0cmVhbXMiLCJ0aW1lIiwic2VuZEJlYWNvbnMiLCJwcyIsImdldEFkc0ZvclRpbWUiLCJtYXAiLCJhZCIsInRyYWNraW5nVXJscyIsImZpbHRlciIsInRVUkwiLCJraW5kIiwic3RhcnRUaW1lIiwiaW5jbHVkZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInB1c2giLCJhbGwiLCJnZXRBZEJyZWFrcyIsImVuZFRpbWUiLCJDb25maWd1cmF0aW9uIiwidHJhY2tpbmdVUkxzIiwicmVkdWNlIiwiYWRzIiwiZmluZEluZGV4IiwidCIsImFkSUQiLCJpZCIsImNvbmNhdCIsInBhcnNlZENvbmZpZ3VyYXRpb24iLCJwYXJzZUZyb21PYmplY3QiLCJqc29uIiwibWVkaWEiLCJvYmoiLCJ0b051bWJlciIsInN0YXJ0dGltZSIsImVuZHRpbWUiLCJldmVudCIsInJlbmRpdGlvbnMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REEsK0M7Ozs7Ozs7QUNBQTs7QUFDQUEsT0FBT0MsY0FBUCxDQUFzQkMsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkMsRUFBRUMsT0FBTyxJQUFULEVBQTdDO0FBQ0EsSUFBTUMsV0FBVyxtQkFBQUMsQ0FBUSxDQUFSLENBQWpCO0FBQ0FILFFBQVFJLE1BQVIsR0FBaUJGLFNBQVNHLE9BQTFCLEM7Ozs7Ozs7QUNIQTs7Ozs7O0FBQ0FQLE9BQU9DLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDLEVBQUVDLE9BQU8sSUFBVCxFQUE3QztBQUNBLElBQU1LLFVBQVUsbUJBQUFILENBQVEsQ0FBUixDQUFoQjtBQUNBLElBQU1JLElBQUksbUJBQUFKLENBQVEsQ0FBUixDQUFWO0FBQ0EsSUFBTUssa0JBQWtCLG1CQUFBTCxDQUFRLENBQVIsQ0FBeEI7O0lBQ01DLE07QUFDRixzQkFBYztBQUFBOztBQUNWLGFBQUtLLFdBQUwsR0FBbUIsRUFBbkI7QUFDSDtBQUNEOzs7Ozs7Ozs7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Q0FBd0JGLEdBQXhCLENBQTRCO0FBQUEsMkJBQVE7QUFDOUNmLDZCQUFLMEMsSUFBSTFDLEdBRHFDO0FBRTlDcUIsbUNBQVd4QixFQUFFOEMsUUFBRixDQUFXRCxJQUFJRSxTQUFmLENBRm1DO0FBRzlDaEIsaUNBQVMvQixFQUFFOEMsUUFBRixDQUFXRCxJQUFJRyxPQUFmLENBSHFDO0FBSTlDekIsOEJBQU1zQixJQUFJSSxLQUpvQztBQUs5Q1gsOEJBQU1PLElBQUlQO0FBTG9DLHFCQUFSO0FBQUEsaUJBQTVCLENBRFg7QUFRSHpCLHlCQUFTOEIsS0FBS0MsS0FBTCxDQUFXTSxVQUFYLENBQXNCaEMsR0FBdEIsQ0FBMEI7QUFBQSwyQkFBUTtBQUN2Q2YsNkJBQUswQyxJQUFJMUM7QUFEOEIscUJBQVI7QUFBQSxpQkFBMUI7QUFSTixhQUFQO0FBWUg7Ozs7OztBQStCTFYsUUFBUUssT0FBUixHQUFrQmtDLGFBQWxCLEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJsb2Rhc2hcIiksIHJlcXVpcmUoXCJheGlvc1wiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJsb2Rhc2hcIiwgXCJheGlvc1wiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhZGVhc2VcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJsb2Rhc2hcIiksIHJlcXVpcmUoXCJheGlvc1wiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiYWRlYXNlXCJdID0gZmFjdG9yeShyb290W1wiX1wiXSwgcm9vdFtcImF4aW9zXCJdKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzBfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zX18pIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgM2U4NDdlODQyNjYzNzZjMTc1NmQiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMF9fO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJsb2Rhc2hcIixcImNvbW1vbmpzMlwiOlwibG9kYXNoXCIsXCJhbWRcIjpcImxvZGFzaFwiLFwicm9vdFwiOlwiX1wifVxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFkZWFzZV8xID0gcmVxdWlyZShcIi4vQWRlYXNlXCIpO1xuZXhwb3J0cy5BZGVhc2UgPSBBZGVhc2VfMS5kZWZhdWx0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBheGlvc18xID0gcmVxdWlyZShcImF4aW9zXCIpO1xuY29uc3QgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XG5jb25zdCBDb25maWd1cmF0aW9uXzEgPSByZXF1aXJlKFwiLi9Db25maWd1cmF0aW9uXCIpO1xuY2xhc3MgQWRlYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZW50QmVhY29ucyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEb3dubG9hZHMgYWRlYXNlIGNvbmZpZ3VyYXRpb24gZnJvbSBhIFVSTCwgcmV0dXJuaW5nIGEgcHJvbWlzZVxuICAgICAqIHRoYXQgcmVzb2x2ZXMgd2l0aCB1bmRlZmluZWQgd2hlbiBkb25lLlxuICAgICAqIEBwYXJhbSB1cmwgc3RyaW5nXG4gICAgICogQHJldHVybiBQcm9taXNlPHZvaWQ+XG4gICAgICovXG4gICAgY29uZmlndXJlRnJvbVVSTCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIGF4aW9zXzEuZGVmYXVsdFxuICAgICAgICAgICAgLmdldCh1cmwpXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmRhdGEpXG4gICAgICAgICAgICAudGhlbihDb25maWd1cmF0aW9uXzEuZGVmYXVsdC5mcm9tSlNPTilcbiAgICAgICAgICAgIC50aGVuKGNvbmZpZyA9PiAodGhpcy5jb25maWcgPSBjb25maWcpKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgZ2V0U3RyZWFtcygpIHtcbiAgICAgICAgdGhpcy5lbnN1cmVTZXR1cCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZ2V0Q29uZmlnKCkuc3RyZWFtcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTm90aWZ5IGFkZWFzZSB0aGF0IGEgdGltZSB1cGRhdGUgaGFzIG9jY3VyZWQuIFRoaXMgbWF5IGZpcmUgb2ZmIGJlYWNvbnMuXG4gICAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCB1bmRlcmx5aW5nIGFjdGlvbnMgaGF2ZSBjb21wbGV0ZWQuXG4gICAgICovXG4gICAgbm90aWZ5VGltZVVwZGF0ZSh0aW1lKSB7XG4gICAgICAgIHRoaXMuZW5zdXJlU2V0dXAoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZEJlYWNvbnModGltZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm4gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgYmVhY29ucyBhcmUgc2VudC5cbiAgICAgKi9cbiAgICBzZW5kQmVhY29ucyh0aW1lKSB7XG4gICAgICAgIGNvbnN0IHBzID0gdGhpcy5nZXRBZHNGb3JUaW1lKHRpbWUpXG4gICAgICAgICAgICAubWFwKGFkID0+IHtcbiAgICAgICAgICAgIHJldHVybiBfKGFkLnRyYWNraW5nVXJscylcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHRVUkwgPT4gdFVSTC5raW5kID09PSBcImltcHJlc3Npb25cIilcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHRVUkwgPT4gdFVSTC5zdGFydFRpbWUgPCB0aW1lKVxuICAgICAgICAgICAgICAgIC5tYXAodFVSTCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZXModGhpcy5zZW50QmVhY29ucywgdFVSTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNlbnRCZWFjb25zLnB1c2godFVSTCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF4aW9zXzEuZGVmYXVsdC5nZXQodFVSTC51cmwpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHMpLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgZ2V0QWRzRm9yVGltZSh0aW1lKSB7XG4gICAgICAgIHJldHVybiBfKHRoaXMuY29uZmlnLmdldEFkQnJlYWtzKCkpLmZpbHRlcihhZCA9PiBhZC5zdGFydFRpbWUgPD0gdGltZSAmJiBhZC5lbmRUaW1lID49IHRpbWUpO1xuICAgIH1cbiAgICBlbnN1cmVTZXR1cCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZykge1xuICAgICAgICAgICAgdGhyb3cgXCJBZGVhc2Ugbm90IHNldHVwLCBidXQgbWV0aG9kIGNhbGxlZFwiO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQWRlYXNlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0FkZWFzZS50cyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJheGlvc1wiXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5jbGFzcyBDb25maWd1cmF0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tSlNPTihjb25maWcpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkQ29uZmlndXJhdGlvbiA9IENvbmZpZ3VyYXRpb24ucGFyc2VGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIGlmIChwYXJzZWRDb25maWd1cmF0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcImVycm9yIHBhcnNpbmcgY29uZmlndXJhdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQ29uZmlndXJhdGlvbihwYXJzZWRDb25maWd1cmF0aW9uKTtcbiAgICB9XG4gICAgc3RhdGljIHBhcnNlRnJvbU9iamVjdChqc29uKSB7XG4gICAgICAgIGlmICghKGpzb24gJiYganNvbi5tZWRpYSAmJiBqc29uLm1lZGlhLnRyYWNraW5nVXJscykpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmFja2luZ1VSTHM6IGpzb24ubWVkaWEudHJhY2tpbmdVcmxzLm1hcChvYmogPT4gKHtcbiAgICAgICAgICAgICAgICB1cmw6IG9iai51cmwsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBfLnRvTnVtYmVyKG9iai5zdGFydHRpbWUpLFxuICAgICAgICAgICAgICAgIGVuZFRpbWU6IF8udG9OdW1iZXIob2JqLmVuZHRpbWUpLFxuICAgICAgICAgICAgICAgIGtpbmQ6IG9iai5ldmVudCxcbiAgICAgICAgICAgICAgICBhZElEOiBvYmouYWRJRCxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHN0cmVhbXM6IGpzb24ubWVkaWEucmVuZGl0aW9ucy5tYXAob2JqID0+ICh7XG4gICAgICAgICAgICAgICAgdXJsOiBvYmoudXJsLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRBZEJyZWFrcygpIHtcbiAgICAgICAgcmV0dXJuIF8odGhpcy5jb25maWcudHJhY2tpbmdVUkxzKVxuICAgICAgICAgICAgLmZpbHRlcih0VVJMID0+IHRVUkwua2luZCA9PT0gJ2NsaWNrdGhyb3VnaCcpXG4gICAgICAgICAgICAucmVkdWNlKChhZHMsIHRVUkwpID0+IHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIGFuIGV4aXN0aW5nIGFkIHdpdGggdGhpcyBzdGFydCB0aW1lLlxuICAgICAgICAgICAgaWYgKF8uZmluZEluZGV4KGFkcywgYWQgPT4gYWQuc3RhcnRUaW1lID09PSB0VVJMLnN0YXJ0VGltZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEdldCB0aGUgdHJhY2tpbmcgVVJMcyBmb3IgdGhpcyBhZC5cbiAgICAgICAgICAgIGNvbnN0IHRyYWNraW5nVVJMcyA9IF8odGhpcy5jb25maWcudHJhY2tpbmdVUkxzKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIodCA9PiB0LmFkSUQgPT09IHRVUkwuYWRJRFxuICAgICAgICAgICAgICAgICYmIHQuc3RhcnRUaW1lID49IHRVUkwuc3RhcnRUaW1lXG4gICAgICAgICAgICAgICAgJiYgdC5lbmRUaW1lIDw9IHRVUkwuZW5kVGltZSlcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgICAgIGNvbnN0IGFkID0ge1xuICAgICAgICAgICAgICAgIGlkOiB0VVJMLmFkSUQsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lOiB0VVJMLnN0YXJ0VGltZSxcbiAgICAgICAgICAgICAgICBlbmRUaW1lOiB0VVJMLmVuZFRpbWUsXG4gICAgICAgICAgICAgICAgdHJhY2tpbmdVcmxzOiB0cmFja2luZ1VSTHMsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIF8uY29uY2F0KGFkcywgYWQpO1xuICAgICAgICB9LCBbXSk7XG4gICAgfVxuICAgIGdldENvbmZpZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICAgIH1cbiAgICBnZXRUcmFja2luZ1VSTHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy50cmFja2luZ1VSTHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gQ29uZmlndXJhdGlvbjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Db25maWd1cmF0aW9uLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==
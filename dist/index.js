(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash"], factory);
	else if(typeof exports === 'object')
		exports["adease"] = factory(require("lodash"));
	else
		root["adease"] = factory(root["_"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
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
var _ = __webpack_require__(0);
var Configuration_1 = __webpack_require__(3);

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
                return _(ad.trackingUrls).filter(function (tURL) {
                    return tURL.kind === "impression";
                }).filter(function (tURL) {
                    return tURL.startTime < time;
                }).map(function (tURL) {
                    if (_.includes(_this2.sentBeacons, tURL)) {
                        return Promise.resolve();
                    }
                    _this2.sentBeacons.push(tURL);
                    return fetch(tURL.url);
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

            if (!this.config || !this.config.trackingURLs) {
                return [];
            }
            return this.config.trackingURLs.filter(function (tURL) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5MTA3NTNmZmNkODRiZTUwYzJmMCIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImxvZGFzaFwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2hcIixcImFtZFwiOlwibG9kYXNoXCIsXCJyb290XCI6XCJfXCJ9Iiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQWRlYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9Db25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiQWRlYXNlXzEiLCJyZXF1aXJlIiwiQWRlYXNlIiwiZGVmYXVsdCIsIl8iLCJDb25maWd1cmF0aW9uXzEiLCJzZW50QmVhY29ucyIsInVybCIsImZldGNoIiwidGhlbiIsInJlcyIsImpzb24iLCJmcm9tSlNPTiIsImNvbmZpZyIsInVuZGVmaW5lZCIsImVuc3VyZVNldHVwIiwiZ2V0Q29uZmlnIiwic3RyZWFtcyIsInRpbWUiLCJzZW5kQmVhY29ucyIsInBzIiwiZ2V0QWRzRm9yVGltZSIsIm1hcCIsImFkIiwidHJhY2tpbmdVcmxzIiwiZmlsdGVyIiwidFVSTCIsImtpbmQiLCJzdGFydFRpbWUiLCJpbmNsdWRlcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicHVzaCIsImFsbCIsImdldEFkQnJlYWtzIiwiZW5kVGltZSIsIkNvbmZpZ3VyYXRpb24iLCJ0cmFja2luZ1VSTHMiLCJyZWR1Y2UiLCJhZHMiLCJmaW5kSW5kZXgiLCJ0IiwiYWRJRCIsImlkIiwiY29uY2F0IiwicGFyc2VkQ29uZmlndXJhdGlvbiIsInBhcnNlRnJvbU9iamVjdCIsIm1lZGlhIiwib2JqIiwidG9OdW1iZXIiLCJzdGFydHRpbWUiLCJlbmR0aW1lIiwiZXZlbnQiLCJyZW5kaXRpb25zIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBLCtDOzs7Ozs7O0FDQUE7O0FBQ0FBLE9BQU9DLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDLEVBQUVDLE9BQU8sSUFBVCxFQUE3QztBQUNBLElBQU1DLFdBQVcsbUJBQUFDLENBQVEsQ0FBUixDQUFqQjtBQUNBSCxRQUFRSSxNQUFSLEdBQWlCRixTQUFTRyxPQUExQixDOzs7Ozs7O0FDSEE7Ozs7OztBQUNBUCxPQUFPQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QyxFQUFFQyxPQUFPLElBQVQsRUFBN0M7QUFDQSxJQUFNSyxJQUFJLG1CQUFBSCxDQUFRLENBQVIsQ0FBVjtBQUNBLElBQU1JLGtCQUFrQixtQkFBQUosQ0FBUSxDQUFSLENBQXhCOztJQUNNQyxNO0FBQ0Ysc0JBQWM7QUFBQTs7QUFDVixhQUFLSSxXQUFMLEdBQW1CLEVBQW5CO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozt5Q0FNaUJDLEcsRUFBSztBQUFBOztBQUNsQixtQkFBT0MsTUFBTUQsR0FBTixFQUNGRSxJQURFLENBQ0c7QUFBQSx1QkFBT0MsSUFBSUMsSUFBSixFQUFQO0FBQUEsYUFESCxFQUVGRixJQUZFLENBRUdKLGdCQUFnQkYsT0FBaEIsQ0FBd0JTLFFBRjNCLEVBR0ZILElBSEUsQ0FHRztBQUFBLHVCQUFXLE1BQUtJLE1BQUwsR0FBY0EsTUFBekI7QUFBQSxhQUhILEVBSUZKLElBSkUsQ0FJRztBQUFBLHVCQUFNSyxTQUFOO0FBQUEsYUFKSCxDQUFQO0FBS0g7OztxQ0FDWTtBQUNULGlCQUFLQyxXQUFMO0FBQ0EsbUJBQU8sS0FBS0YsTUFBTCxDQUFZRyxTQUFaLEdBQXdCQyxPQUEvQjtBQUNIO0FBQ0Q7Ozs7Ozs7eUNBSWlCQyxJLEVBQU07QUFDbkIsaUJBQUtILFdBQUw7QUFDQSxtQkFBTyxLQUFLSSxXQUFMLENBQWlCRCxJQUFqQixDQUFQO0FBQ0g7QUFDRDs7Ozs7O29DQUdZQSxJLEVBQU07QUFBQTs7QUFDZCxnQkFBTUUsS0FBSyxLQUFLQyxhQUFMLENBQW1CSCxJQUFuQixFQUNOSSxHQURNLENBQ0YsY0FBTTtBQUNYLHVCQUFPbEIsRUFBRW1CLEdBQUdDLFlBQUwsRUFDRkMsTUFERSxDQUNLO0FBQUEsMkJBQVFDLEtBQUtDLElBQUwsS0FBYyxZQUF0QjtBQUFBLGlCQURMLEVBRUZGLE1BRkUsQ0FFSztBQUFBLDJCQUFRQyxLQUFLRSxTQUFMLEdBQWlCVixJQUF6QjtBQUFBLGlCQUZMLEVBR0ZJLEdBSEUsQ0FHRSxnQkFBUTtBQUNiLHdCQUFJbEIsRUFBRXlCLFFBQUYsQ0FBVyxPQUFLdkIsV0FBaEIsRUFBNkJvQixJQUE3QixDQUFKLEVBQXdDO0FBQ3BDLCtCQUFPSSxRQUFRQyxPQUFSLEVBQVA7QUFDSDtBQUNELDJCQUFLekIsV0FBTCxDQUFpQjBCLElBQWpCLENBQXNCTixJQUF0QjtBQUNBLDJCQUFPbEIsTUFBTWtCLEtBQUtuQixHQUFYLENBQVA7QUFDSCxpQkFUTSxFQVVGUixLQVZFLEVBQVA7QUFXSCxhQWJVLEVBY05BLEtBZE0sRUFBWDtBQWVBLG1CQUFPK0IsUUFBUUcsR0FBUixDQUFZYixFQUFaLEVBQWdCWCxJQUFoQixDQUFxQjtBQUFBLHVCQUFNSyxTQUFOO0FBQUEsYUFBckIsQ0FBUDtBQUNIOzs7c0NBQ2FJLEksRUFBTTtBQUNoQixtQkFBT2QsRUFBRSxLQUFLUyxNQUFMLENBQVlxQixXQUFaLEVBQUYsRUFBNkJULE1BQTdCLENBQW9DO0FBQUEsdUJBQU1GLEdBQUdLLFNBQUgsSUFBZ0JWLElBQWhCLElBQXdCSyxHQUFHWSxPQUFILElBQWNqQixJQUE1QztBQUFBLGFBQXBDLENBQVA7QUFDSDs7O3NDQUNhO0FBQ1YsZ0JBQUksQ0FBQyxLQUFLTCxNQUFWLEVBQWtCO0FBQ2Qsc0JBQU0scUNBQU47QUFDSDtBQUNKOzs7Ozs7QUFFTGYsUUFBUUssT0FBUixHQUFrQkQsTUFBbEIsQzs7Ozs7OztBQy9EQTs7Ozs7O0FBQ0FOLE9BQU9DLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDLEVBQUVDLE9BQU8sSUFBVCxFQUE3QztBQUNBLElBQU1LLElBQUksbUJBQUFILENBQVEsQ0FBUixDQUFWO0FBQ0E7Ozs7SUFHTW1DLGE7QUFDRiwyQkFBWXZCLE1BQVosRUFBb0I7QUFBQTs7QUFDaEIsYUFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0g7Ozs7c0NBeUJhO0FBQUE7O0FBQ1YsZ0JBQUksQ0FBQyxLQUFLQSxNQUFOLElBQWdCLENBQUMsS0FBS0EsTUFBTCxDQUFZd0IsWUFBakMsRUFBK0M7QUFDM0MsdUJBQU8sRUFBUDtBQUNIO0FBQ0QsbUJBQU8sS0FBS3hCLE1BQUwsQ0FBWXdCLFlBQVosQ0FDRlosTUFERSxDQUNLO0FBQUEsdUJBQVFDLEtBQUtDLElBQUwsS0FBYyxjQUF0QjtBQUFBLGFBREwsRUFFRlcsTUFGRSxDQUVLLFVBQUNDLEdBQUQsRUFBTWIsSUFBTixFQUFlO0FBQ3ZCO0FBQ0Esb0JBQUl0QixFQUFFb0MsU0FBRixDQUFZRCxHQUFaLEVBQWlCO0FBQUEsMkJBQU1oQixHQUFHSyxTQUFILEtBQWlCRixLQUFLRSxTQUE1QjtBQUFBLGlCQUFqQixNQUE0RCxDQUFDLENBQWpFLEVBQW9FO0FBQ2hFLDJCQUFPVyxHQUFQO0FBQ0g7QUFDRDtBQUNBLG9CQUFNRixlQUFlakMsRUFBRSxNQUFLUyxNQUFMLENBQVl3QixZQUFkLEVBQ2hCWixNQURnQixDQUNUO0FBQUEsMkJBQUtnQixFQUFFQyxJQUFGLEtBQVdoQixLQUFLZ0IsSUFBaEIsSUFDVkQsRUFBRWIsU0FBRixJQUFlRixLQUFLRSxTQURWLElBRVZhLEVBQUVOLE9BQUYsSUFBYVQsS0FBS1MsT0FGYjtBQUFBLGlCQURTLEVBSWhCcEMsS0FKZ0IsRUFBckI7QUFLQSxvQkFBTXdCLEtBQUs7QUFDUG9CLHdCQUFJakIsS0FBS2dCLElBREY7QUFFUGQsK0JBQVdGLEtBQUtFLFNBRlQ7QUFHUE8sNkJBQVNULEtBQUtTLE9BSFA7QUFJUFgsa0NBQWNhO0FBSlAsaUJBQVg7QUFNQSx1QkFBT2pDLEVBQUV3QyxNQUFGLENBQVNMLEdBQVQsRUFBY2hCLEVBQWQsQ0FBUDtBQUNILGFBcEJNLEVBb0JKLEVBcEJJLENBQVA7QUFxQkg7OztvQ0FDVztBQUNSLG1CQUFPLEtBQUtWLE1BQVo7QUFDSDs7OzBDQUNpQjtBQUNkLG1CQUFPLEtBQUtBLE1BQUwsQ0FBWXdCLFlBQW5CO0FBQ0g7OztpQ0F2RGV4QixNLEVBQVE7QUFDcEIsZ0JBQU1nQyxzQkFBc0JULGNBQWNVLGVBQWQsQ0FBOEJqQyxNQUE5QixDQUE1QjtBQUNBLGdCQUFJZ0Msd0JBQXdCLElBQTVCLEVBQWtDO0FBQzlCLHNCQUFNLDZCQUFOO0FBQ0g7QUFDRCxtQkFBTyxJQUFJVCxhQUFKLENBQWtCUyxtQkFBbEIsQ0FBUDtBQUNIOzs7d0NBQ3NCbEMsSSxFQUFNO0FBQ3pCLGdCQUFJLEVBQUVBLFFBQVFBLEtBQUtvQyxLQUFiLElBQXNCcEMsS0FBS29DLEtBQUwsQ0FBV3ZCLFlBQW5DLENBQUosRUFBc0Q7QUFDbEQsdUJBQU8sSUFBUDtBQUNIO0FBQ0QsbUJBQU87QUFDSGEsOEJBQWMxQixLQUFLb0MsS0FBTCxDQUFXdkIsWUFBWCxDQUF3QkYsR0FBeEIsQ0FBNEI7QUFBQSwyQkFBUTtBQUM5Q2YsNkJBQUt5QyxJQUFJekMsR0FEcUM7QUFFOUNxQixtQ0FBV3hCLEVBQUU2QyxRQUFGLENBQVdELElBQUlFLFNBQWYsQ0FGbUM7QUFHOUNmLGlDQUFTL0IsRUFBRTZDLFFBQUYsQ0FBV0QsSUFBSUcsT0FBZixDQUhxQztBQUk5Q3hCLDhCQUFNcUIsSUFBSUksS0FKb0M7QUFLOUNWLDhCQUFNTSxJQUFJTjtBQUxvQyxxQkFBUjtBQUFBLGlCQUE1QixDQURYO0FBUUh6Qix5QkFBU04sS0FBS29DLEtBQUwsQ0FBV00sVUFBWCxDQUFzQi9CLEdBQXRCLENBQTBCO0FBQUEsMkJBQVE7QUFDdkNmLDZCQUFLeUMsSUFBSXpDO0FBRDhCLHFCQUFSO0FBQUEsaUJBQTFCO0FBUk4sYUFBUDtBQVlIOzs7Ozs7QUFrQ0xULFFBQVFLLE9BQVIsR0FBa0JpQyxhQUFsQixDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwibG9kYXNoXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImxvZGFzaFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhZGVhc2VcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJsb2Rhc2hcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFkZWFzZVwiXSA9IGZhY3Rvcnkocm9vdFtcIl9cIl0pO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMF9fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDkxMDc1M2ZmY2Q4NGJlNTBjMmYwIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzBfXztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwibG9kYXNoXCIsXCJjb21tb25qczJcIjpcImxvZGFzaFwiLFwiYW1kXCI6XCJsb2Rhc2hcIixcInJvb3RcIjpcIl9cIn1cbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBZGVhc2VfMSA9IHJlcXVpcmUoXCIuL0FkZWFzZVwiKTtcbmV4cG9ydHMuQWRlYXNlID0gQWRlYXNlXzEuZGVmYXVsdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC50cyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XG5jb25zdCBDb25maWd1cmF0aW9uXzEgPSByZXF1aXJlKFwiLi9Db25maWd1cmF0aW9uXCIpO1xuY2xhc3MgQWRlYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZW50QmVhY29ucyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEb3dubG9hZHMgYWRlYXNlIGNvbmZpZ3VyYXRpb24gZnJvbSBhIFVSTCwgcmV0dXJuaW5nIGEgcHJvbWlzZVxuICAgICAqIHRoYXQgcmVzb2x2ZXMgd2l0aCB1bmRlZmluZWQgd2hlbiBkb25lLlxuICAgICAqIEBwYXJhbSB1cmwgc3RyaW5nXG4gICAgICogQHJldHVybiBQcm9taXNlPHZvaWQ+XG4gICAgICovXG4gICAgY29uZmlndXJlRnJvbVVSTCh1cmwpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oQ29uZmlndXJhdGlvbl8xLmRlZmF1bHQuZnJvbUpTT04pXG4gICAgICAgICAgICAudGhlbihjb25maWcgPT4gKHRoaXMuY29uZmlnID0gY29uZmlnKSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIGdldFN0cmVhbXMoKSB7XG4gICAgICAgIHRoaXMuZW5zdXJlU2V0dXAoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmdldENvbmZpZygpLnN0cmVhbXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE5vdGlmeSBhZGVhc2UgdGhhdCBhIHRpbWUgdXBkYXRlIGhhcyBvY2N1cmVkLiBUaGlzIG1heSBmaXJlIG9mZiBiZWFjb25zLlxuICAgICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgdW5kZXJseWluZyBhY3Rpb25zIGhhdmUgY29tcGxldGVkLlxuICAgICAqL1xuICAgIG5vdGlmeVRpbWVVcGRhdGUodGltZSkge1xuICAgICAgICB0aGlzLmVuc3VyZVNldHVwKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRCZWFjb25zKHRpbWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIGJlYWNvbnMgYXJlIHNlbnQuXG4gICAgICovXG4gICAgc2VuZEJlYWNvbnModGltZSkge1xuICAgICAgICBjb25zdCBwcyA9IHRoaXMuZ2V0QWRzRm9yVGltZSh0aW1lKVxuICAgICAgICAgICAgLm1hcChhZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXyhhZC50cmFja2luZ1VybHMpXG4gICAgICAgICAgICAgICAgLmZpbHRlcih0VVJMID0+IHRVUkwua2luZCA9PT0gXCJpbXByZXNzaW9uXCIpXG4gICAgICAgICAgICAgICAgLmZpbHRlcih0VVJMID0+IHRVUkwuc3RhcnRUaW1lIDwgdGltZSlcbiAgICAgICAgICAgICAgICAubWFwKHRVUkwgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGVzKHRoaXMuc2VudEJlYWNvbnMsIHRVUkwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZW50QmVhY29ucy5wdXNoKHRVUkwpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmZXRjaCh0VVJMLnVybCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcykudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICAgIH1cbiAgICBnZXRBZHNGb3JUaW1lKHRpbWUpIHtcbiAgICAgICAgcmV0dXJuIF8odGhpcy5jb25maWcuZ2V0QWRCcmVha3MoKSkuZmlsdGVyKGFkID0+IGFkLnN0YXJ0VGltZSA8PSB0aW1lICYmIGFkLmVuZFRpbWUgPj0gdGltZSk7XG4gICAgfVxuICAgIGVuc3VyZVNldHVwKCkge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkFkZWFzZSBub3Qgc2V0dXAsIGJ1dCBtZXRob2QgY2FsbGVkXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBBZGVhc2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQWRlYXNlLnRzIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcbi8qKlxuICogQGludGVybmFsXG4gKi9cbmNsYXNzIENvbmZpZ3VyYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG4gICAgc3RhdGljIGZyb21KU09OKGNvbmZpZykge1xuICAgICAgICBjb25zdCBwYXJzZWRDb25maWd1cmF0aW9uID0gQ29uZmlndXJhdGlvbi5wYXJzZUZyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgaWYgKHBhcnNlZENvbmZpZ3VyYXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiZXJyb3IgcGFyc2luZyBjb25maWd1cmF0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBDb25maWd1cmF0aW9uKHBhcnNlZENvbmZpZ3VyYXRpb24pO1xuICAgIH1cbiAgICBzdGF0aWMgcGFyc2VGcm9tT2JqZWN0KGpzb24pIHtcbiAgICAgICAgaWYgKCEoanNvbiAmJiBqc29uLm1lZGlhICYmIGpzb24ubWVkaWEudHJhY2tpbmdVcmxzKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRyYWNraW5nVVJMczoganNvbi5tZWRpYS50cmFja2luZ1VybHMubWFwKG9iaiA9PiAoe1xuICAgICAgICAgICAgICAgIHVybDogb2JqLnVybCxcbiAgICAgICAgICAgICAgICBzdGFydFRpbWU6IF8udG9OdW1iZXIob2JqLnN0YXJ0dGltZSksXG4gICAgICAgICAgICAgICAgZW5kVGltZTogXy50b051bWJlcihvYmouZW5kdGltZSksXG4gICAgICAgICAgICAgICAga2luZDogb2JqLmV2ZW50LFxuICAgICAgICAgICAgICAgIGFkSUQ6IG9iai5hZElELFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc3RyZWFtczoganNvbi5tZWRpYS5yZW5kaXRpb25zLm1hcChvYmogPT4gKHtcbiAgICAgICAgICAgICAgICB1cmw6IG9iai51cmwsXG4gICAgICAgICAgICB9KSksXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldEFkQnJlYWtzKCkge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnIHx8ICF0aGlzLmNvbmZpZy50cmFja2luZ1VSTHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcudHJhY2tpbmdVUkxzXG4gICAgICAgICAgICAuZmlsdGVyKHRVUkwgPT4gdFVSTC5raW5kID09PSAnY2xpY2t0aHJvdWdoJylcbiAgICAgICAgICAgIC5yZWR1Y2UoKGFkcywgdFVSTCkgPT4ge1xuICAgICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYW4gZXhpc3RpbmcgYWQgd2l0aCB0aGlzIHN0YXJ0IHRpbWUuXG4gICAgICAgICAgICBpZiAoXy5maW5kSW5kZXgoYWRzLCBhZCA9PiBhZC5zdGFydFRpbWUgPT09IHRVUkwuc3RhcnRUaW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gR2V0IHRoZSB0cmFja2luZyBVUkxzIGZvciB0aGlzIGFkLlxuICAgICAgICAgICAgY29uc3QgdHJhY2tpbmdVUkxzID0gXyh0aGlzLmNvbmZpZy50cmFja2luZ1VSTHMpXG4gICAgICAgICAgICAgICAgLmZpbHRlcih0ID0+IHQuYWRJRCA9PT0gdFVSTC5hZElEXG4gICAgICAgICAgICAgICAgJiYgdC5zdGFydFRpbWUgPj0gdFVSTC5zdGFydFRpbWVcbiAgICAgICAgICAgICAgICAmJiB0LmVuZFRpbWUgPD0gdFVSTC5lbmRUaW1lKVxuICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICAgICAgY29uc3QgYWQgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IHRVUkwuYWRJRCxcbiAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHRVUkwuc3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgIGVuZFRpbWU6IHRVUkwuZW5kVGltZSxcbiAgICAgICAgICAgICAgICB0cmFja2luZ1VybHM6IHRyYWNraW5nVVJMcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gXy5jb25jYXQoYWRzLCBhZCk7XG4gICAgICAgIH0sIFtdKTtcbiAgICB9XG4gICAgZ2V0Q29uZmlnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gICAgfVxuICAgIGdldFRyYWNraW5nVVJMcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnRyYWNraW5nVVJMcztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb25maWd1cmF0aW9uO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbmZpZ3VyYXRpb24udHMiXSwic291cmNlUm9vdCI6IiJ9
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable"], factory);
	else if(typeof exports === 'object')
		exports["adease"] = factory(require("immutable"));
	else
		root["adease"] = factory(root["immutable"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
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
var immutable_1 = __webpack_require__(2);
var Configuration_1 = __webpack_require__(3);
var Util_1 = __webpack_require__(4);

var Adease = function () {
    function Adease() {
        _classCallCheck(this, Adease);

        this.sentBeacons = immutable_1.Set();
        this.lastTimePosition = NaN;
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

            this.reset();
            return fetch(url).then(function (res) {
                return res.json();
            }).then(Configuration_1.default.fromJSON).then(function (_) {
                return _this.config = _;
            }).then(function () {
                return undefined;
            });
        }
        /**
         * Downloads adease configuration from a URL, returning a promise
         * that resolves with undefined when done.
         * @param url string
         * @return Promise<void>
         */

    }, {
        key: "configureFromObject",
        value: function configureFromObject(object) {
            this.reset();
            this.config = Configuration_1.default.fromJSON(object);
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
         *
         * @param timeMs number Time in milliseconds.
         */

    }, {
        key: "notifyTimeUpdate",
        value: function notifyTimeUpdate(timeMs) {
            var _this2 = this;

            this.ensureSetup();
            if (this.lastTimePosition === NaN) {
                this.lastTimePosition = 0;
            }
            return this.sendBeacons(timeMs).then(function () {
                return _this2.lastTimePosition = timeMs;
            }).then(function () {
                return undefined;
            });
        }
        /**
         *
         * @param assetTimeMs Returns the real stream time.
         */

    }, {
        key: "getStreamTime",
        value: function getStreamTime(assetTimeMs) {
            this.ensureSetup();
            // Calculate the true start times of each ad.
            var ads = this.getAds().sort(function (a, b) {
                if (a.startTime < b.startTime) {
                    return -1;
                }
                if (a.startTime > b.startTime) {
                    return 1;
                }
                return 0;
            });
            var position = assetTimeMs;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = ads[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var ad = _step.value;

                    // Position is in the middle of an ad. Move to end.
                    if (position >= ad.startTime && position < ad.endTime) {
                        console.log("here");
                        position += ad.endTime;
                    } else if (position >= ad.endTime) {
                        position += ad.endTime;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return Util_1.round(position);
        }
        /**
         * Returns the ads.
         */

    }, {
        key: "getAds",
        value: function getAds() {
            this.ensureSetup();
            return this.config.getAdBreaks();
        }
        /**
         *
         * @param timeMs Time in milliseconds.
         */

    }, {
        key: "getAdsAtTime",
        value: function getAdsAtTime(timeMs) {
            this.ensureSetup();
            return this.config.getAdBreaks().filter(function (ad) {
                return ad.startTime <= timeMs && ad.endTime >= timeMs;
            });
        }
        /**
         *
         * @param streamTimeMs number Time in milliseconds.
         * @returns number Time in milliseconds.
         */

    }, {
        key: "getAssetTime",
        value: function getAssetTime(streamTimeMs) {
            this.ensureSetup();
            var add = function add(a, b) {
                return a + b;
            };
            // Find the ads before the given time.
            var allAds = this.config.getAdBreaks().filter(function (ad) {
                return ad.startTime < streamTimeMs;
            });
            var previousAdsDuration = allAds.filter(function (ad) {
                return ad.endTime <= streamTimeMs;
            }).map(function (ad) {
                return ad.endTime - ad.startTime;
            }).reduce(add, 0);
            var inProgressAdsDuration = allAds.filter(function (ad) {
                return ad.endTime > streamTimeMs;
            }).map(function (ad) {
                return streamTimeMs - ad.startTime;
            }).reduce(add, 0);
            return Util_1.round(streamTimeMs - (previousAdsDuration + inProgressAdsDuration));
        }
        /**
         * @return A promise that resolves once all beacons are sent.
         */

    }, {
        key: "sendBeacons",
        value: function sendBeacons(time) {
            var _this3 = this;

            var ps = this.getBeaconsForRange(this.lastTimePosition, time).filter(function (tURL) {
                return Configuration_1.LinearEvents.includes(tURL.kind);
            }).filter(function (tURL) {
                return tURL.startTime < time && tURL.startTime > _this3.lastTimePosition;
            }).map(function (tURL) {
                if (_this3.sentBeacons.includes(tURL)) {
                    return Promise.resolve();
                }
                _this3.sentBeacons = _this3.sentBeacons.add(tURL);
                return fetch(tURL.url, {
                    mode: "no-cors"
                }).then(function () {
                    return undefined;
                });
            });
            return Promise.all(ps).then(function () {
                return undefined;
            });
        }
    }, {
        key: "getBeaconsForRange",
        value: function getBeaconsForRange(start, end) {
            return this.config.getTrackingURLs().filter(function (tURL) {
                return tURL.startTime <= end && tURL.endTime >= start;
            });
        }
    }, {
        key: "ensureSetup",
        value: function ensureSetup() {
            if (!this.config) {
                throw new Error("Adease not setup, but method called");
            }
        }
        /**
         * Resets the internal state of the object so that it can be reused.
         */

    }, {
        key: "reset",
        value: function reset() {
            this.sentBeacons = this.sentBeacons.clear();
        }
    }]);

    return Adease;
}();

exports.default = Adease;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    // Basic metrics
    EventType["Impression"] = "impression";
    EventType["Clickthrough"] = "clickthrough";
    EventType["Stream"] = "stream";
    EventType["Fullscreen"] = "fullscreen";
    EventType["ExitFullscreen"] = "exitFullscreen";
    EventType["OtherAdInteraction"] = "otherAdInteraction";
    // Linear Ad Metrics
    EventType["Start"] = "start";
    EventType["FirstQuartile"] = "firstQuartile";
    EventType["MidPoint"] = "midpoint";
    EventType["ThirdQuartile"] = "thirdQuartile";
    EventType["Complete"] = "complete";
    EventType["AcceptInvitationLinear"] = "acceptInvitationLinear";
    EventType["TimeSpentViewing"] = "timeSpentViewing";
    EventType["Progress"] = "progress";
    EventType["CloseLinear"] = "closeLinear";
    // Nonlinear Ad Metrics
    EventType["CreativeView"] = "creativeView";
    EventType["AcceptInvitation"] = "acceptInvitation";
    EventType["AdExpand"] = "adExpand";
    EventType["AdCollapse"] = "adCollapse";
    EventType["Minimize"] = "minimize";
    EventType["Close"] = "close";
    EventType["OverlayViewDuration"] = "overlayViewDuration";
    // Player Operation Metrics (for both Linear and Nonlinear ads)
    EventType["Mute"] = "mute";
    EventType["Unmute"] = "unmute";
    EventType["Pause"] = "pause";
    EventType["Resume"] = "resume";
    EventType["Rewind"] = "rewind";
    EventType["Skip"] = "skip";
    EventType["PlayerExpand"] = "playerExpand";
    EventType["PlayerCollapse"] = "playerCollapse";
})(EventType = exports.EventType || (exports.EventType = {}));
exports.NonLinearEvents = [EventType.CreativeView, EventType.AcceptInvitation, EventType.AdExpand, EventType.Minimize, EventType.Close, EventType.OverlayViewDuration];
exports.LinearEvents = [EventType.Start, EventType.Impression, EventType.FirstQuartile, EventType.MidPoint, EventType.ThirdQuartile, EventType.Complete, EventType.AcceptInvitationLinear, EventType.TimeSpentViewing, EventType.Progress, EventType.CloseLinear];
exports.PlayerEvents = [EventType.Mute, EventType.Unmute, EventType.Pause, EventType.Resume, EventType.Rewind, EventType.Skip, EventType.PlayerExpand, EventType.PlayerCollapse];
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
                return tURL.kind === EventType.Clickthrough;
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
                    trackingUrls: trackingURLs,
                    clickThroughs: trackingURLs.filter(function (tURL) {
                        return tURL.kind === EventType.Clickthrough;
                    })
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
                throw new Error("error parsing configuration");
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Rounds to two decimal places.
 * @param n number to round
 */
function round(n) {
  return Math.round(n * 100) / 100;
}
exports.round = round;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("immutable"),require("query-string")):"function"==typeof define&&define.amd?define("adease",["immutable","query-string"],t):"object"==typeof exports?exports.adease=t(require("immutable"),require("query-string")):e.adease=t(e.immutable,e["query-string"])}("undefined"!=typeof self?self:this,function(e,t){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=5)}([function(t,n){t.exports=e},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.round=function(e){return Math.round(100*e)/100}},function(e,t,n){"use strict";var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var i,u=n(0);!function(e){e.Impression="impression",e.Clickthrough="clickthrough",e.Stream="stream",e.Fullscreen="fullscreen",e.ExitFullscreen="exitFullscreen",e.OtherAdInteraction="otherAdInteraction",e.Start="start",e.FirstQuartile="firstQuartile",e.MidPoint="midpoint",e.ThirdQuartile="thirdQuartile",e.Complete="complete",e.AcceptInvitationLinear="acceptInvitationLinear",e.TimeSpentViewing="timeSpentViewing",e.Progress="progress",e.CloseLinear="closeLinear",e.CreativeView="creativeView",e.AcceptInvitation="acceptInvitation",e.AdExpand="adExpand",e.AdCollapse="adCollapse",e.Minimize="minimize",e.Close="close",e.OverlayViewDuration="overlayViewDuration",e.Mute="mute",e.Unmute="unmute",e.Pause="pause",e.Resume="resume",e.Rewind="rewind",e.Skip="skip",e.PlayerExpand="playerExpand",e.PlayerCollapse="playerCollapse"}(i=t.EventType||(t.EventType={})),t.NonLinearEvents=[i.CreativeView,i.AcceptInvitation,i.AdExpand,i.Minimize,i.Close,i.OverlayViewDuration],t.LinearEvents=[i.Start,i.Impression,i.FirstQuartile,i.MidPoint,i.ThirdQuartile,i.Complete,i.AcceptInvitationLinear,i.TimeSpentViewing,i.Progress,i.CloseLinear],t.PlayerEvents=[i.Mute,i.Unmute,i.Pause,i.Resume,i.Rewind,i.Skip,i.PlayerExpand,i.PlayerCollapse];var o=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.config=t}return r(e,[{key:"pushTrackingURLs",value:function(e){this.config.trackingURLs=this.config.trackingURLs.concat(e).toList()}},{key:"getAdBreaks",value:function(){var e=this;return this.config&&this.config.trackingURLs?this.config.trackingURLs.filter(function(e){return!!e&&e.kind===i.Clickthrough}).reduce(function(t,n){if(-1!==t.findIndex(function(e){return!!e&&e.startTime===n.startTime}))return t;var r=u.List(e.config.trackingURLs.filter(function(e){return!!e&&(e.adID===n.adID&&e.startTime>=n.startTime&&e.endTime<=n.endTime)})),o={id:n.adID,startTime:n.startTime,endTime:n.endTime,trackingUrls:r,clickThroughs:u.List(r.filter(function(e){return!!e&&e.kind===i.Clickthrough}))};return t.push(o)},u.List()):u.List()}},{key:"getConfig",value:function(){return this.config}},{key:"getTrackingURLs",value:function(){return this.config.trackingURLs}}],[{key:"fromJSON",value:function(t){var n=e.parseFromObject(t);if(null===n)throw new Error("error parsing configuration");return new e(n)}},{key:"parseFromObject",value:function(t){return t&&t.media&&t.media.trackingUrls?{trackingURLs:u.List(t.media.trackingUrls.map(e.convertTrackingURLJSON)),streams:u.List(t.media.renditions.map(function(e){return{url:e.url}})),isLive:t.media.live||!1}:null}},{key:"getDurationFromClickthrough",value:function(e){return e.filter(function(e){return!!e&&e.kind===i.Clickthrough}).reduce(function(e,t){return t?t.endTime-t.startTime:0},0)}},{key:"convertTrackingURLJSON",value:function(e){return{url:e.url,startTime:Number(e.starttime),endTime:Number(e.endtime),kind:e.event,adID:e.adID}}}]),e}();t.default=o},function(e,n){e.exports=t},function(e,t,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0});var u=n(0),o=n(3),a=n(2),s=n(1),c=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.version="1.0.2",this.serverURL=t||"",this.liveQueryParams=n||{},this.sentBeacons=u.Set(),this.lastTimePosition=NaN}return i(e,[{key:"configureFromURL",value:function(e){var t=this;return this.reset(),fetch(e).then(function(e){return e.json()}).then(a.default.fromJSON).then(function(e){return t.config=e}).then(function(){})}},{key:"configureFromObject",value:function(e){this.reset(),this.config=a.default.fromJSON(e)}},{key:"getStreams",value:function(){return this.ensureSetup(),this.config.getConfig().streams.toJS()}},{key:"notifyTimeUpdate",value:function(e){var t=this;return this.ensureSetup(),NaN===this.lastTimePosition&&(this.lastTimePosition=0),this.sendBeacons(e).then(function(){return t.lastTimePosition=e}).then(function(){})}},{key:"notifyID3Event",value:function(e,t){var n=this,r=e.indexOf("switch.tv"),i=function(e){var t=e.split(":");return t.length>0?t[1].trim():""};if(-1===r)return Promise.resolve();if((e=e.slice(r+"switch.tv".length)).includes("CUE:")){var u=i(e);this.currentCuepointID=u}else{if(e.includes("ADSTART:")){var o=i(e);return this.retrieveLiveAdBreakTracking(this.currentCuepointID,o).then(function(e){return e.map(function(e){return e?Object.assign({},e,{startTime:e.startTime+t,endTime:e.endTime+t}):e}).toList()}).then(function(e){return n.config.pushTrackingURLs(e)})}e.includes("ADEND:")}return Promise.resolve()}},{key:"notifyPlayerEvent",value:function(e,t){return this.sendBeacons(t,e)}},{key:"getStreamTime",value:function(e){this.ensureSetup();var t=this.getAds().sort(function(e,t){return e.startTime<t.startTime?-1:e.startTime>t.startTime?1:0}),n=e,r=!0,i=!1,u=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done);r=!0){var c=o.value;n>=c.startTime&&(n+=c.endTime-c.startTime)}}catch(e){i=!0,u=e}finally{try{!r&&a.return&&a.return()}finally{if(i)throw u}}return s.round(n)}},{key:"getAds",value:function(){return this.ensureSetup(),this.config.getAdBreaks().toJS()}},{key:"getAdsAtTime",value:function(e){return this.ensureSetup(),this.config.getAdBreaks().filter(function(t){return!!t&&(t.startTime<=e&&t.endTime>=e)}).toJS()}},{key:"getAssetTime",value:function(e){this.ensureSetup();var t=function(e,t){return e+t},n=this.config.getAdBreaks().filter(function(t){return!!t&&t.startTime<e}),r=n.filter(function(t){return!!t&&t.endTime<=e}).map(function(e){return!!e&&e.endTime-e.startTime}).reduce(t,0),i=n.filter(function(t){return!!t&&t.endTime>e}).map(function(t){return t?e-t.startTime:t}).reduce(t,0);return s.round(e-(r+i))}},{key:"retrieveLiveAdBreakTracking",value:function(e,t){var n=o.stringify(Object.assign({},this.liveQueryParams,{cuepointID:e,adID:t}));return fetch(this.serverURL+"/stream/tracking?"+n).then(function(e){return e.json()}).then(function(e){return e&&"object"===r(e.data)&&e.data.hasOwnProperty("length")?u.List(e.data.map(a.default.convertTrackingURLJSON)):u.List()})}},{key:"sendBeacons",value:function(e,t){var n=this,r=function(e){return a.LinearEvents.includes(e.kind)},i=this.getBeaconsForRange(this.lastTimePosition,e).filter(null!=t?function(e){return!!e&&e.kind===t}:function(e){return!!e&&a.LinearEvents.includes(e.kind)}).filter(function(t){return!!t&&(r(t)?t.startTime<e&&t.startTime>n.lastTimePosition:t.startTime<=e&&t.endTime>e)}).map(function(e){if(!e)return Promise.resolve();if(r(e)){if(e&&n.sentBeacons.includes(e))return Promise.resolve();n.sentBeacons=n.sentBeacons.add(e)}return fetch(e.url,{mode:"no-cors"}).then(function(){})}).toJS();return Promise.all(i).then(function(){})}},{key:"getBeaconsForRange",value:function(e,t){return this.config.getTrackingURLs().filter(function(n){return!!n&&(n.startTime<=t&&n.endTime>=e)}).toList()}},{key:"ensureSetup",value:function(){if(!this.config)throw new Error("Adease not setup, but method called")}},{key:"reset",value:function(){this.sentBeacons=this.sentBeacons.clear()}}]),e}();t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(4);t.Adease=r.default}])});
//# sourceMappingURL=index.js.map
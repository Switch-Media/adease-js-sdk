const config: any = {
  _type: "playback",
  autoPlayOnSeek: "false",
  skin: {
    _type: "skin",
    osd: { _type: "osd", infoContainer: "true" },
    startFullscreen: "false",
    hideOsdTimeout: "3000",
    hideOsdInstantly: "false",
    showAdRemaining: "true",
    showOsd: "true",
    rampedSeek: "true",
    noUserInput: "true",
    closeOnLastPlayed: "false",
    HTML: "http://foxtel-uat-adease.switchmedia.asia/280/skin/getSkin?file=vcms"
  },
  components: {
    _type: "components",
    player: "urn:tv.switch.player",
    skin: "urn:tv.switch.skin",
    playlist: "urn:tv.switch.playlist",
    bookmarks: "urn:tv.switch.bookmarks.json",
    captions: "urn:tv.switch.captions.webvtt"
  },
  media: {
    _type: "media",
    duration: 3368.16,
    autoplay: "false",
    staticImage:
      "siteID=280&videoID=2513759&group=STILL&tag=IMAGE&f=jpg&w=1366&returnDefault=true&fileID=",
    downloadButton: "false",
    shareButton: "false",
    renditions: [
      {
        _type: "array",
        audioOnly: "false",
        url: "/adease/manifest/280/playlist.mpd",
        plainUrl: "/adease/manifest/280/playlist.mpd",
        videoContainer: "MPDURL",
        quality: "Auto"
      }
    ],
    state: "APPROVED",
    expired: "0000-00-00 00:00:00",
    type: "VIDEO",
    assetID: "2513759",
    sessionID: "204409537",
    trackingUrls: [
      {
        _type: "array",
        starttime: "0",
        endtime: "30080",
        event: "clicktracking",
        url: "http://",
        adID: "90988",
        adVideoID: "2492794",
        adURL: "http://ds.serving-sys.com/"
      },
      {
        _type: "array",
        starttime: "0",
        endtime: "30080",
        event: "stream",
        adID: "90988",
        adVideoID: "2492794",
        adURL: "http://ds.serving-sys.com/",
        renditions: [
          {
            _type: "array",
            audioOnly: "false",
            url: "http://",
            videoContainer: "HLSURL",
            quality: "Auto",
            index: 0
          }
        ]
      },
      {
        _type: "array",
        starttime: "0",
        endtime: "30080",
        event: "clickthrough",
        url: "https://bs.serving-sys.com/",
        adID: "90988",
        adVideoID: "2492794",
        adURL: "http://ds.serving-sys.com/"
      },
      {
        _type: "array",
        starttime: "847880",
        endtime: "877972",
        event: "clickthrough",
        url: "http://pubads.g.doubleclick.net/",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/"
      },
      {
        _type: "array",
        starttime: "847880",
        endtime: "877972",
        event: "stream",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/",
        renditions: [
          {
            _type: "array",
            audioOnly: "false",
            url: "http://foxtel-uat-adease.switchmedia.asia/",
            videoContainer: "HLSURL",
            quality: "Auto",
            index: 0
          }
        ]
      },
      {
        _type: "array",
        starttime: "1873702",
        endtime: "1903794",
        event: "clickthrough",
        url: "http://pubads.g.doubleclick.net/",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/"
      },
      {
        _type: "array",
        starttime: "1873702",
        endtime: "1903794",
        event: "stream",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/",
        renditions: [
          {
            _type: "array",
            audioOnly: "false",
            url: "http://foxtel-uat-adease.switchmedia.asia/",
            videoContainer: "HLSURL",
            quality: "Auto",
            index: 0
          }
        ]
      },
      {
        _type: "array",
        starttime: "2415594",
        endtime: "2445686",
        event: "clickthrough",
        url: "http://pubads.g.doubleclick.net/",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/"
      },
      {
        _type: "array",
        starttime: "2415594",
        endtime: "2445686",
        event: "stream",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/",
        renditions: [
          {
            _type: "array",
            audioOnly: "false",
            url: "http://foxtel-uat-adease.switchmedia.asia/",
            videoContainer: "HLSURL",
            quality: "Auto",
            index: 0
          }
        ]
      },
      {
        _type: "array",
        starttime: "2807926",
        endtime: "2838018",
        event: "clickthrough",
        url: "http://pubads.g.doubleclick.net/",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/"
      },
      {
        _type: "array",
        starttime: "2807926",
        endtime: "2838018",
        event: "stream",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/",
        renditions: [
          {
            _type: "array",
            audioOnly: "false",
            url: "http://foxtel-uat-adease.switchmedia.asia/",
            videoContainer: "HLSURL",
            quality: "Auto",
            index: 0
          }
        ]
      },
      {
        _type: "array",
        starttime: "3518818",
        endtime: "3548910",
        event: "clickthrough",
        url: "http://pubads.g.doubleclick.net/",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/"
      },
      {
        _type: "array",
        starttime: "3518818",
        endtime: "3548910",
        event: "stream",
        adID: "90914",
        adVideoID: "2492626",
        adURL: "http://redirector.gvt1.com/",
        renditions: [
          {
            _type: "array",
            audioOnly: "false",
            url: "http://foxtel-uat-adease.switchmedia.asia/",
            videoContainer: "HLSURL",
            quality: "Auto",
            index: 0
          }
        ]
      }
    ],
    adBreaks: [
      ["0", "30.08"],
      ["847.88", "877.972"],
      ["1327.812", "1328.022"],
      ["1873.702", "1903.794"],
      ["2415.594", "2445.686"],
      ["2807.926", "2838.018"],
      ["3518.818", "3548.91"]
    ],
    captions: [],
    synopsis: null,
    title: "ID: TEST_FXTL_ON",
    cuePointMetaData: [
      {
        _type: "array",
        position: "817.8",
        position_end: "0",
        label: "Ad break 1",
        data: ""
      },
      {
        _type: "array",
        position: "1267.64",
        position_end: "0",
        label: "Ad break 2",
        data: ""
      },
      {
        _type: "array",
        position: "1813.32",
        position_end: "0",
        label: "Ad break 3",
        data: ""
      },
      {
        _type: "array",
        position: "2325.12",
        position_end: "0",
        label: "Ad break 4",
        data: ""
      },
      {
        _type: "array",
        position: "2687.36",
        position_end: "0",
        label: "Ad break 5",
        data: ""
      }
    ]
  },
  ads: {
    _type: "ads",
    skipAdsDuringSeek: "true",
    controls: {
      _type: "controls",
      pause: "true",
      seek: "false",
      stop: "false"
    },
    playLastSkippedAd: "true"
  },
  analytics: {
    _type: "analytics",
    sessionID: 204409537,
    userID: 0,
    userRole: null,
    siteID: "280",
    assetID: "2513759",
    externalID: null,
    referrer: "",
    url: "http://foxtel-uat-adease.switchmedia.asia/280/analytics/",
    filters: {
      _type: "filters",
      ad_firstQuartile: 1,
      ad_midpoint: 1,
      ad_thirdQuartile: 1,
      ad_complete: 1,
      ad_clickTracking: 1,
      ad_clicktracking: 1,
      ad_closeLinear: 1,
      ad_fullscreen: 1,
      ad_exitFullscreen: 1,
      ad_pause: 1,
      ad_resume: 1,
      ad_mute: 1,
      ad_unmute: 1,
      ad_rewind: 1
    }
  },
  sessionDataUrl: ""
};

export default config;

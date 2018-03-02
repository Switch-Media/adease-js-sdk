export interface IAd {
  id: string;
  startTime: number;
  endTime: number;
  trackingUrls: ITrackingURL[];
  clickThroughs: ITrackingURL[];
}

export interface ITrackingURL {
  url: string;
  startTime: number;
  endTime: number;
  kind: string;
  adID: string;
}

export interface IConfiguration {
  trackingURLs: ITrackingURL[];
  streams: IStream[];
}

export interface IConfigurationJSON {
  media: {
    trackingUrls: Array<{
      starttime: string;
      endtime: string;
      event: string;
      url: string;
      adID: string;
    }>;

    renditions: Array<{
      url: string;
      quality: string;
    }>;
  };
}

export interface IStream {
  url: string;
}

export enum EventType {
  // Basic metrics
  Impression = "impression",
  Clickthrough = "clickthrough",
  Stream = "stream",
  Fullscreen = "fullscreen",
  ExitFullscreen = "exitFullscreen",
  OtherAdInteraction = "otherAdInteraction",

  // Linear Ad Metrics
  Start = "start",
  FirstQuartile = "firstQuartile",
  MidPoint = "midpoint",
  ThirdQuartile = "thirdQuartile",
  Complete = "complete",
  AcceptInvitationLinear = "acceptInvitationLinear",
  TimeSpentViewing = "timeSpentViewing",
  Progress = "progress",
  CloseLinear = "closeLinear",

  // Nonlinear Ad Metrics
  CreativeView = "creativeView",
  AcceptInvitation = "acceptInvitation",
  AdExpand = "adExpand",
  AdCollapse = "adCollapse",
  Minimize = "minimize",
  Close = "close",
  OverlayViewDuration = "overlayViewDuration",

  // Player Operation Metrics (for both Linear and Nonlinear ads)
  Mute = "mute",
  Unmute = "unmute",
  Pause = "pause",
  Resume = "resume",
  Rewind = "rewind",
  Skip = "skip",
  PlayerExpand = "playerExpand",
  PlayerCollapse = "playerCollapse"
}

export const NonLinearEvents = [
  EventType.CreativeView,
  EventType.AcceptInvitation,
  EventType.AdExpand,
  EventType.Minimize,
  EventType.Close,
  EventType.OverlayViewDuration
];

export const LinearEvents = [
  EventType.Start,
  EventType.Impression,
  EventType.FirstQuartile,
  EventType.MidPoint,
  EventType.ThirdQuartile,
  EventType.Complete,
  EventType.AcceptInvitationLinear,
  EventType.TimeSpentViewing,
  EventType.Progress,
  EventType.CloseLinear
];

export const PlayerEvents = [
  EventType.Mute,
  EventType.Unmute,
  EventType.Pause,
  EventType.Resume,
  EventType.Rewind,
  EventType.Skip,
  EventType.PlayerExpand,
  EventType.PlayerCollapse
];

/**
 * @internal
 */
export default class Configuration {
  private config: IConfiguration;

  constructor(config: IConfiguration) {
    this.config = config;
  }

  public static fromJSON(config: IConfigurationJSON): Configuration {
    const parsedConfiguration = Configuration.parseFromObject(config);
    if (parsedConfiguration === null) {
      throw new Error("error parsing configuration");
    }
    return new Configuration(parsedConfiguration);
  }

  public static parseFromObject(
    json: IConfigurationJSON
  ): IConfiguration | null {
    if (!(json && json.media && json.media.trackingUrls)) {
      return null;
    }

    return {
      trackingURLs: json.media.trackingUrls.map(obj => ({
        url: obj.url,
        startTime: Number(obj.starttime),
        endTime: Number(obj.endtime),
        kind: obj.event,
        adID: obj.adID
      })),

      streams: json.media.renditions.map(obj => ({
        url: obj.url
      }))
    };
  }

  public getAdBreaks(): IAd[] {
    if (!this.config || !this.config.trackingURLs) {
      return [];
    }
    return this.config.trackingURLs
      .filter(tURL => tURL.kind === "clickthrough")
      .reduce((ads: IAd[], tURL: ITrackingURL) => {
        // Try to find an existing ad with this start time.
        if (ads.findIndex(ad => ad.startTime === tURL.startTime) !== -1) {
          return ads;
        }

        // Get the tracking URLs for this ad.
        const trackingURLs = this.config.trackingURLs.filter(
          t =>
            t.adID === tURL.adID &&
            t.startTime >= tURL.startTime &&
            t.endTime <= tURL.endTime
        );

        const ad: IAd = {
          id: tURL.adID,
          startTime: tURL.startTime,
          endTime: tURL.endTime,
          trackingUrls: trackingURLs,
          clickThroughs: [],
        };

        return ads.concat(ad);
      }, []);
  }

  public getConfig(): IConfiguration {
    return this.config;
  }

  public getTrackingURLs(): ITrackingURL[] {
    return this.config.trackingURLs;
  }
}

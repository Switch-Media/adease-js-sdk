import { List } from 'immutable';

export interface IAd {
  id: string;
  startTime: number;
  endTime: number;
  trackingUrls: List<ITrackingURL>;
  clickThroughs: List<ITrackingURL>;
};

export interface ITrackingURL {
  url: string;
  startTime: number;
  endTime: number;
  kind: string;
  adID: string;
}

export interface IConfiguration {
  trackingURLs: List<ITrackingURL>;
  streams: List<IStream>;
}

/**
 * Used to map the incoming JSON from the server to something we can work with.
 * Assumptions are made here about what format the returned data is in.
 */
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

    live: boolean;
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
      trackingURLs: List(json.media.trackingUrls.map(obj => ({
        url: obj.url,
        startTime: Number(obj.starttime),
        endTime: Number(obj.endtime),
        kind: obj.event,
        adID: obj.adID
      }))),

      streams: List(json.media.renditions.map(obj => ({
        url: obj.url
      })))
    };
  }

  public getAdBreaks(): List<IAd> {
    if (!this.config || !this.config.trackingURLs) {
      return List<IAd>();
    }
    return this.config.trackingURLs
      .filter(tURL => tURL ? tURL.kind === EventType.Clickthrough : false)
      .reduce((ads: List<IAd>, tURL: ITrackingURL) => {
        // Try to find an existing ad with this start time.
        if (ads.findIndex(ad => ad ? ad.startTime === tURL.startTime : false) !== -1) {
          return ads;
        }

        // Get the tracking URLs for this ad.
        const trackingURLs = List<ITrackingURL>(this.config.trackingURLs.filter(
          t =>
            t ? 
            t.adID === tURL.adID &&
            t.startTime >= tURL.startTime &&
            t.endTime <= tURL.endTime
            : false
        ));

        const ad: IAd = {
          id: tURL.adID,
          startTime: tURL.startTime,
          endTime: tURL.endTime,
          trackingUrls: trackingURLs,
          clickThroughs: List(trackingURLs.filter(tURL => tURL ? tURL.kind === EventType.Clickthrough : false)),
        };

        return ads.push(ad);
      }, List<IAd>());
  }

  public getConfig(): IConfiguration {
    return this.config;
  }

  public getTrackingURLs(): List<ITrackingURL> {
    return this.config.trackingURLs;
  }
}

import { List } from "immutable";
export interface IAd {
    id: string;
    startTime: number;
    endTime: number;
    trackingUrls: List<ITrackingURL>;
    clickThroughs: List<ITrackingURL>;
}
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
    isLive: boolean;
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
export declare enum EventType {
    Impression = "impression",
    Clickthrough = "clickthrough",
    Stream = "stream",
    Fullscreen = "fullscreen",
    ExitFullscreen = "exitFullscreen",
    OtherAdInteraction = "otherAdInteraction",
    Start = "start",
    FirstQuartile = "firstQuartile",
    MidPoint = "midpoint",
    ThirdQuartile = "thirdQuartile",
    Complete = "complete",
    AcceptInvitationLinear = "acceptInvitationLinear",
    TimeSpentViewing = "timeSpentViewing",
    Progress = "progress",
    CloseLinear = "closeLinear",
    CreativeView = "creativeView",
    AcceptInvitation = "acceptInvitation",
    AdExpand = "adExpand",
    AdCollapse = "adCollapse",
    Minimize = "minimize",
    Close = "close",
    OverlayViewDuration = "overlayViewDuration",
    Mute = "mute",
    Unmute = "unmute",
    Pause = "pause",
    Resume = "resume",
    Rewind = "rewind",
    Skip = "skip",
    PlayerExpand = "playerExpand",
    PlayerCollapse = "playerCollapse",
}
export declare const NonLinearEvents: EventType[];
export declare const LinearEvents: EventType[];
export declare const PlayerEvents: EventType[];
/**
 * @internal
 */
export default class Configuration {
    private config;
    constructor(config: IConfiguration);
    static fromJSON(config: IConfigurationJSON): Configuration;
    static parseFromObject(json: IConfigurationJSON): IConfiguration | null;
    pushTrackingURLs(trackingURLs: List<ITrackingURL>): void;
    getAdBreaks(): List<IAd>;
    static getDurationFromClickthrough(trackingURLs: List<ITrackingURL>): number;
    static convertTrackingURLJSON(obj: any): ITrackingURL;
    getConfig(): IConfiguration;
    getTrackingURLs(): List<ITrackingURL>;
}

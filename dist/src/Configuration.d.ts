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
    getAdBreaks(): IAd[];
    getConfig(): IConfiguration;
    getTrackingURLs(): ITrackingURL[];
}

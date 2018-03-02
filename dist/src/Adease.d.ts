import { IStream, IAd } from "./Configuration";
export default class Adease {
    private config;
    private sentBeacons;
    private lastTimePosition;
    constructor();
    /**
     * Downloads adease configuration from a URL, returning a promise
     * that resolves with undefined when done.
     * @param url string
     * @return Promise<void>
     */
    configureFromURL(url: string): Promise<undefined>;
    /**
     * Downloads adease configuration from a URL, returning a promise
     * that resolves with undefined when done.
     * @param url string
     * @return Promise<void>
     */
    configureFromObject(object: any): void;
    getStreams(): IStream[];
    /**
     * Notify adease that a time update has occured. This may fire off beacons.
     * Returns a promise that resolves once all underlying actions have completed.
     *
     * @param timeMs number Time in milliseconds.
     */
    notifyTimeUpdate(timeMs: number): Promise<undefined>;
    /**
     *
     * @param assetTimeMs Returns the real stream time.
     */
    getStreamTime(assetTimeMs: number): number;
    /**
     * Returns the ads.
     */
    getAds(): IAd[];
    /**
     *
     * @param timeMs Time in milliseconds.
     */
    getAdsAtTime(timeMs: number): IAd[];
    /**
     *
     * @param streamTimeMs number Time in milliseconds.
     * @returns number Time in milliseconds.
     */
    getAssetTime(streamTimeMs: number): number;
    /**
     * @return A promise that resolves once all beacons are sent.
     */
    private sendBeacons(time);
    private getBeaconsForRange(start, end);
    private ensureSetup();
    /**
     * Resets the internal state of the object so that it can be reused.
     */
    private reset();
}

import { IAd, IStream } from "./Configuration";
export declare type TQueryParams = {
    [key: string]: string;
};
/**
 * The adease class essentially provides a wrapper around a configuration object.
 * The configuration object contains all of the information regarding where in a stream
 * the ads have been inserted.
 *
 * This class has methods both to query what ads have been inserted where, as well
 * as triggering analytics based on time updates and user initiated actions.
 *
 * Internal state is kept to track what beacons have been sent, and what the last time
 * update was. Whenever configuration is provided this internal state is reset.
 * If this internal state needs to be preserved, then a new instance should be created
 * instead.
 *
 * *NOTE:* All methods except `configureFromURL` and `configureFromObject` will
 * throw an exception if the class has not been provided configuration.  Your
 * code should ensure that the class has been setup before calling any methods;
 * a proxy pattern can work well here. This design choice has been made
 * to avoid silently failing, to increase development/debugging speed.
 */
export default class Adease {
    private config;
    private sentBeacons;
    private lastTimePosition;
    private serverURL;
    private currentCuepointID;
    private liveQueryParams;
    readonly version: string;
    constructor(serverURL?: string, liveQueryParams?: TQueryParams);
    /**
     * Downloads adease configuration from a URL, returning a promise
     * that resolves with undefined when done.
     * @param url string
     * @return Promise<void>
     */
    configureFromURL(url: string): Promise<undefined>;
    /**
     * Configures the class from an object.
     * @param url string
     * @return Promise<void>
     */
    configureFromObject(object: any): void;
    getStreams(): IStream[];
    /**
     * Notify that a time update (position in the stream) has occured. This may fire off beacons.
     * Returns a promise that resolves once all underlying network requests have completed.
     *
     * @param timeMs number Time in milliseconds.
     */
    notifyTimeUpdate(timeMs: number): Promise<undefined>;
    /**
     * For live only.
     *
     * Call when an ID3 tag is detected in the metadata track.
     *
     * @param tag The string tag of the event;
     * @param timeMs The time in milliseconds that the event appears in the stream.
     * @returns A promise that resolves once all undelying actions have completed.
     */
    notifyID3Event(tag: string, timeMs: number): Promise<void>;
    /**
     * Since inserting ads into a stream changes the duration, it can be useful to translate
     * between the original time of the asset and the corresponding time in the loaded stream.
     * This method returns the time in the stream that a position in the original asset corresponds to.
     *
     * For example, 5 seconds into the original asset would be 35 seconds in the loaded stream
     * if a 30 second pre roll has been inserted.
     *
     * @param assetTimeMs Returns the real stream time.
     */
    getStreamTime(assetTimeMs: number): number;
    /**
     * Returns the ads.
     */
    getAds(): IAd[];
    /**
     * Returns the ads that are present at a given moment. In practice this
     * will only ever return either an empty list, or a list with one element.
     * It is theoretically possible for more than one ad to be returned,
     * however this makes no practical sense.
     *
     * @param timeMs Time in milliseconds.
     */
    getAdsAtTime(timeMs: number): IAd[];
    /**
     * This is the inverse of `getStreamTime`. It returns the time in an asset
     * that the loaded stream time corresponds to. For example, if the time 35 seconds is
     * given, then 5 seconds will be returned if a 30 second pre roll has been inserted.
     *
     * @param streamTimeMs number Time in milliseconds.
     * @returns number Time in milliseconds.
     */
    getAssetTime(streamTimeMs: number): number;
    private retrieveLiveAdBreakTracking(cuepointID, adID);
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

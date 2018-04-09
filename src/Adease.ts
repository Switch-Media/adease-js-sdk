import { Set, List } from "immutable";
import Configuration, {
  EventType,
  IAd,
  IConfigurationJSON,
  IStream,
  ITrackingURL,
  LinearEvents
} from "./Configuration";
import { round } from "./Util";

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
  private config: Configuration;
  private sentBeacons: Set<ITrackingURL>;
  private lastTimePosition: number;

  constructor() {
    this.sentBeacons = Set<ITrackingURL>();
    this.lastTimePosition = NaN;
  }

  /**
   * Downloads adease configuration from a URL, returning a promise
   * that resolves with undefined when done.
   * @param url string
   * @return Promise<void>
   */
  public configureFromURL(url: string): Promise<undefined> {
    this.reset();
    return fetch(url)
      .then(res => res.json() as Promise<IConfigurationJSON>)
      .then(Configuration.fromJSON)
      .then(_ => (this.config = _))
      .then(() => undefined);
  }

  /**
   * Configures the class from an object.
   * @param url string
   * @return Promise<void>
   */
  public configureFromObject(object: any): void {
    this.reset();
    this.config = Configuration.fromJSON(object);
  }

  public getStreams(): IStream[] {
    this.ensureSetup();
    return this.config.getConfig().streams.toJS();
  }

  /**
   * Notify that a time update (position in the stream) has occured. This may fire off beacons.
   * Returns a promise that resolves once all underlying network requests have completed.
   *
   * @param timeMs number Time in milliseconds.
   */
  public notifyTimeUpdate(timeMs: number): Promise<undefined> {
    this.ensureSetup();

    if (this.lastTimePosition === NaN) {
      this.lastTimePosition = 0;
    }
    return this.sendBeacons(timeMs)
      .then(() => (this.lastTimePosition = timeMs))
      .then(() => undefined);
  }

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
  public getStreamTime(assetTimeMs: number): number {
    this.ensureSetup();

    // Calculate the true start times of each ad.
    const ads = this.getAds().sort((a: IAd, b: IAd): number => {
      if (a.startTime < b.startTime) {
        return -1;
      }
      if (a.startTime > b.startTime) {
        return 1;
      }
      return 0;
    });

    let position = assetTimeMs;
    for (const ad of ads) {
      // Position is in the middle of an ad. Move to end.
      if (position >= ad.startTime) {
        position += ad.endTime;
      }
    }

    return round(position);
  }

  /**
   * Returns the ads.
   */
  public getAds(): IAd[] {
    this.ensureSetup();
    return this.config.getAdBreaks().toJS();
  }

  /**
   * Returns the ads that are present at a given moment. In practice this
   * will only ever return either an empty list, or a list with one element.
   * It is theoretically possible for more than one ad to be returned,
   * however this makes no practical sense.
   *
   * @param timeMs Time in milliseconds.
   */
  public getAdsAtTime(timeMs: number): IAd[] {
    this.ensureSetup();
    return this.config
      .getAdBreaks()
      .filter(ad => ad ? ad.startTime <= timeMs && ad.endTime >= timeMs : false)
      .toJS();
  }

  /**
   * This is the inverse of `getStreamTime`. It returns the time in an asset
   * that the loaded stream time corresponds to. For example, if the time 35 seconds is
   * given, then 5 seconds will be returned if a 30 second pre roll has been inserted.
   *
   * @param streamTimeMs number Time in milliseconds.
   * @returns number Time in milliseconds.
   */
  public getAssetTime(streamTimeMs: number): number {
    this.ensureSetup();

    const add = (a: number, b: number) => a + b;

    // Find the ads before the given time.
    const allAds = this.config
      .getAdBreaks()
      .filter(ad => ad ? ad.startTime < streamTimeMs : false);

    const previousAdsDuration = allAds
      .filter(ad => ad ? ad.endTime <= streamTimeMs : false)
      .map(ad => ad ? ad.endTime - ad.startTime : false)
      .reduce(add, 0);

    const inProgressAdsDuration = allAds
      .filter(ad => ad ? ad.endTime > streamTimeMs : false)
      .map(ad => ad ? streamTimeMs - ad.startTime : ad)
      .reduce(add, 0);

    return round(streamTimeMs - (previousAdsDuration + inProgressAdsDuration));
  }

  /**
   * @return A promise that resolves once all beacons are sent.
   */
  private sendBeacons(time: number): Promise<undefined> {
    const ps = this.getBeaconsForRange(this.lastTimePosition, time)
      .filter(tURL => tURL ? LinearEvents.includes(tURL.kind as EventType) : false)
      .filter(
        tURL => tURL ? tURL.startTime < time && tURL.startTime > this.lastTimePosition : false
      )
      .map(tURL => {
        if (!tURL) {
          return Promise.resolve();
        }
        if (tURL && this.sentBeacons.includes(tURL)) {
          return Promise.resolve();
        }
        this.sentBeacons = this.sentBeacons.add(tURL);
        return fetch(tURL.url, {
          mode: "no-cors"
        }).then(() => undefined);
      })
      .toJS();
    return Promise.all(ps).then(() => undefined);
  }

  private getBeaconsForRange(start: number, end: number): List<ITrackingURL> {
    return this.config
      .getTrackingURLs()
      .filter(tURL => tURL ? tURL.startTime <= end && tURL.endTime >= start : false)
      .toList();
  }

  private ensureSetup() {
    if (!this.config) {
      throw new Error("Adease not setup, but method called");
    }
  }

  /**
   * Resets the internal state of the object so that it can be reused.
   */
  private reset() {
    this.sentBeacons = this.sentBeacons.clear();
  }
}

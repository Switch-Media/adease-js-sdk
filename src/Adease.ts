import { Set } from "immutable";

import Configuration, {
  IConfigurationJSON,
  IStream,
  ITrackingURL,
  IAd,
  LinearEvents,
  EventType
} from "./Configuration";

import { round } from "./Util";

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
   * Downloads adease configuration from a URL, returning a promise
   * that resolves with undefined when done.
   * @param url string
   * @return Promise<void>
   */
  public configureFromObject(object: any): void {
    this.reset();
    this.config = Configuration.fromJSON(object);
  }

  public getStreams(): IStream[] {
    this.ensureSetup();
    return this.config.getConfig().streams;
  }

  /**
   * Notify adease that a time update has occured. This may fire off beacons.
   * Returns a promise that resolves once all underlying actions have completed.
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
   *
   * @param assetTimeMs Returns the real stream time.
   */
  public getStreamTime(assetTimeMs: number): number {
    this.ensureSetup();

    return this.getAds().reduce((position: number, ad: IAd) => {
      if (ad.startTime < position) {
        return position + (ad.endTime - ad.startTime);
      }

      return position;
    }, assetTimeMs);
  }

  /**
   * Returns the ads.
   */
  public getAds(): IAd[] {
    this.ensureSetup();
    return this.config.getAdBreaks();
  }

  /**
   * 
   * @param timeMs Time in milliseconds.
   */
  public getAdsAtTime(timeMs: number): IAd[] {
    this.ensureSetup();
    return this.config.getAdBreaks().filter(ad => ad.startTime <= timeMs && ad.endTime >= timeMs);
  }

  /**
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
      .filter(ad => ad.startTime < streamTimeMs);

    const previousAdsDuration = allAds
      .filter(ad => ad.endTime <= streamTimeMs)
      .map(ad => ad.endTime - ad.startTime)
      .reduce(add, 0);

    const inProgressAdsDuration = allAds
      .filter(ad => ad.endTime > streamTimeMs)
      .map(ad => streamTimeMs - ad.startTime)
      .reduce(add, 0);

    return round(streamTimeMs - (previousAdsDuration + inProgressAdsDuration));
  }

  /**
   * @return A promise that resolves once all beacons are sent.
   */
  private sendBeacons(time: number): Promise<undefined> {
    const ps = this.getBeaconsForRange(this.lastTimePosition, time)
      .filter(tURL => LinearEvents.includes(tURL.kind as EventType))
      .filter(
        tURL => tURL.startTime < time && tURL.startTime > this.lastTimePosition
      )
      .map(tURL => {
        if (this.sentBeacons.includes(tURL)) {
          return Promise.resolve();
        }
        this.sentBeacons = this.sentBeacons.add(tURL);
        return fetch(tURL.url, {
          mode: "no-cors"
        }).then(() => undefined);
      });
    return Promise.all(ps).then(() => undefined);
  }

  private getBeaconsForRange(start: number, end: number): ITrackingURL[] {
    return this.config
      .getTrackingURLs()
      .filter(tURL => tURL.startTime <= end && tURL.endTime >= start);
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

import { Set } from "immutable";

import Configuration, {
  IConfigurationJSON,
  IStream,
  ITrackingURL,
  IAd,
  LinearEvents,
  EventType
} from "./Configuration";

export default class Adease {
  config: Configuration;
  sentBeacons: Set<ITrackingURL>;
  lastTimePosition: number;

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
   */
  public notifyTimeUpdate(time: number): Promise<undefined> {
    this.ensureSetup();

    if (this.lastTimePosition === NaN) {
      this.lastTimePosition = 0;
    }
    return this.sendBeacons(time)
      .then(() => (this.lastTimePosition = time))
      .then(() => undefined);
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

import Configuration, {
  IConfigurationJSON,
  IStream,
  ITrackingURL,
  IAd
} from "./Configuration";

export default class Adease {
  config: Configuration;
  sentBeacons: ITrackingURL[];

  constructor() {
    this.sentBeacons = [];
  }

  /**
   * Downloads adease configuration from a URL, returning a promise
   * that resolves with undefined when done.
   * @param url string
   * @return Promise<void>
   */
  public configureFromURL(url: string): Promise<undefined> {
    return fetch(url)
      .then(res => res.json() as Promise<IConfigurationJSON>)
      .then(Configuration.fromJSON)
      .then(config => (this.config = config))
      .then(() => undefined);
  }


  /**
   * Downloads adease configuration from a URL, returning a promise
   * that resolves with undefined when done.
   * @param url string
   * @return Promise<void>
   */
  public configureFromObject(object: any): void {
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
    return this.sendBeacons(time);
  }

  /**
   * @return A promise that resolves once all beacons are sent.
   */
  private sendBeacons(time: number): Promise<undefined> {
    const ps = this.getAdsForTime(time)
      .map(ad => {
        return ad.trackingUrls
          .filter(tURL => tURL.kind === "impression")
          .filter(tURL => tURL.startTime < time)
          .map(tURL => {
            if (this.sentBeacons.includes(tURL)) {
              return Promise.resolve();
            }
            this.sentBeacons.push(tURL);
            return fetch(tURL.url, {
              mode: 'no-cors',
            });
          });
      });
    return Promise.all(ps).then(() => undefined);
  }

  private getAdsForTime(time: number): IAd[] {
    return this.config.getAdBreaks().filter(
      ad => ad.startTime <= time && ad.endTime >= time
    );
  }

  private ensureSetup() {
    if (!this.config) {
      throw "Adease not setup, but method called";
    }
  }
}

import axios from 'axios';
import * as _ from 'lodash';

import Configuration, { IConfigurationJSON, IStream, ITrackingURL } from "./Configuration";

export default class {
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
        return axios.get(url)
        .then(res => (res.data as Promise<IConfigurationJSON>))
        .then(Configuration.fromJSON)
        .then(config => this.config = config)
        .then(() => undefined);
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
        const ps =  _(this.config.getAdBreaks())
        .filter(ad => ad.startTime <= time && ad.endTime >= time)
        .map(ad => {
            return _(ad.trackingUrls)
            .filter(tURL => tURL.kind === 'impression')
            .map(tURL => {
                if (_.includes(this.sentBeacons, tURL)) {
                    return Promise.resolve();
                }
                return axios.get(tURL.url);
            })
            .value();
        })
        .value();
        return Promise.all(ps).then(() => undefined);
        

        // Find beacons for this time.
        /*const ps = _(this.config.getTrackingURLs())
        .filter(tURL => tURL.startTime > time && tURL.kind === 'impression')
        .map(tURL => {
            return axios.get(tURL.url);
        })
        .value();
        return Promise.all(ps).then(() => undefined);*/
    }

    private ensureSetup() {
        if (!this.config) {
            throw 'Adease not setup, but method called';
        }
    }
}
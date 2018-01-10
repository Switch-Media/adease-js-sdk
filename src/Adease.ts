import axios from 'axios';

import Configuration, { IConfigurationJSON, IStream } from "./Configuration";

export default class {
    config: Configuration;

    constructor() {
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
     */
    public notifyTimeUpdate(time: number) {
        this.ensureSetup();

        console.log("timeupdate", time);
    }

    private ensureSetup() {
        if (!this.config) {
            throw 'Adease not setup, but method called';
        }
    }
}
import axios from 'axios';

import Configuration, { IConfigurationJSON } from "./Configuration";

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
}
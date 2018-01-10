import * as _ from 'lodash';

export interface IAd {
    id: string;
    startTime: number;
    endTime: number;
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
}

export interface IConfigurationJSON {
    media: {
        trackingUrls: Array<{
            starttime: string,
            endtime: string,
            event: string,
            url: string,
            adID: string,
        }>,
    },
}

export default class Configuration {

    config: IConfiguration;

    constructor(config: IConfiguration) {
        this.config = config;
    }

    public static fromJSON(config: IConfigurationJSON): Configuration {
        const parsedConfiguration = this.parseFromObject(config);
        if (parsedConfiguration === null) {
            throw "error parsing configuration";
        }
        return new Configuration(parsedConfiguration);
    }

    public static parseFromObject(json: IConfigurationJSON): IConfiguration | null {
        if (!(json && json.media && json.media.trackingUrls)) {
            return null;
        }

        return {
            trackingURLs:  json.media.trackingUrls.map(obj => ({
                url: obj.url,
                startTime: _.toNumber(obj.starttime),
                endTime: _.toNumber(obj.endtime),
                kind: obj.event,
                adID: obj.adID,
            })),
        };
    }

    public getAdBreaks(): IAd[] {
        return _(this.config.trackingURLs)
        .filter(tURL => tURL.kind === 'clickthrough')
        .reduce((ads: IAd[], tURL: ITrackingURL) => {
            // Try to find an existing ad with this start time.
            if (_.findIndex(ads, ad => ad.startTime === tURL.startTime) !== -1) {
                return ads;
            }

            const ad: IAd = {
                id: tURL.adID,
                startTime: tURL.startTime,
                endTime: tURL.endTime,
            };

            return _.concat(ads, ad);
        }, []);
    }
}
import * as _ from 'lodash';

export interface IAd {
    id: string;
    startTime: number;
    endTime: number;
    trackingUrls: ITrackingURL[];
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
    streams: IStream[];
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

        renditions: Array<{
            url: string;
            quality: string;
        }>,
    },
}

export interface IStream {
    url: string;
}

export default class Configuration {

    private config: IConfiguration;

    constructor(config: IConfiguration) {
        this.config = config;
    }

    public static fromJSON(config: IConfigurationJSON): Configuration {
        const parsedConfiguration = Configuration.parseFromObject(config);
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

            streams: json.media.renditions.map(obj => ({
                url: obj.url,
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

            // Get the tracking URLs for this ad.
            const trackingURLs = _(this.config.trackingURLs)
            .filter(t => 
                t.adID === tURL.adID
                && t.startTime >= tURL.startTime
                && t.endTime <= tURL.endTime)
            .value();

            const ad: IAd = {
                id: tURL.adID,
                startTime: tURL.startTime,
                endTime: tURL.endTime,
                trackingUrls: trackingURLs,
            };

            return _.concat(ads, ad);
        }, []);
    }

    public getConfig(): IConfiguration {
        return this.config;
    }

    public getTrackingURLs(): ITrackingURL[] {
        return this.config.trackingURLs;
    }
}
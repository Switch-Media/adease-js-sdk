import { expect } from 'chai';

import Configuration from './Configuration';

import FullConfig from '../fixtures/sample_full_config';

describe('Configuration', () => {
    it('should return null for an empty value', () => {
        expect(Configuration.parseFromObject({} as any)).to.be.null;
    });

    it('should return null for bad values', () => {
        expect(Configuration.parseFromObject(1 as any)).to.be.null;
        expect(Configuration.parseFromObject(Symbol('') as any)).to.be.null;
        expect(Configuration.parseFromObject(null as any)).to.be.null;
    });

    it('should parse tracking urls', () => {
        const config = Configuration.parseFromObject(FullConfig)!;
        expect(config.trackingURLs).to.have.length(535);
        expect(config.trackingURLs[0].adID).to.equal('76895');
        expect(config.trackingURLs[0].startTime).to.equal(1000);
        expect(config.trackingURLs[0].endTime).to.equal(1000);
        expect(config.trackingURLs[0].kind).to.equal('impression');
    });

    it('should find ad breaks', () => {
        const config = Configuration.fromJSON(FullConfig);
        const ads = config.getAdBreaks();

        expect(ads).to.have.length(13);

        expect(ads[0].startTime).to.equal(0);
        expect(ads[0].endTime).to.equal(30514.689);

        expect(ads[1].startTime).to.equal(1407514.689);
        expect(ads[1].endTime).to.equal(1438029.378);

        expect(ads[2].startTime).to.equal(1438029.378);
        expect(ads[2].endTime).to.equal(1453184.067);

        expect(ads[9].startTime).to.equal(3773989.234);
        expect(ads[9].endTime).to.equal(3789100.956);
    });

    it('should get streams', () => {
        const config = Configuration.fromJSON(FullConfig);
        expect(config.getConfig().streams).to.have.length(5);
    });

    it('should get tracking urls', () => {
        const config = Configuration.fromJSON(FullConfig);
        expect(config.getTrackingURLs()).to.have.length(535);
    });
});

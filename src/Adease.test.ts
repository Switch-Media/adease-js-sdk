import { expect } from 'chai';
import * as sinon from 'sinon';
import * as nock from 'nock';

import Adease from './Adease';

// Fixtures
import FullConfig from '../fixtures/sample_full_config';

describe('Adease', () => {
    it('initialises', () => { 
        const adease = new Adease();
        expect(adease).to.be.an.instanceOf(Adease);
    });

    it('retrieves and processes configuration', () => {
        nock('http://localhost')
            .get('/')
            .reply(200, FullConfig);

        const adease = new Adease();
        return adease.configureFromURL('http://localhost').then(value => {
            expect(value).to.be.undefined;
            expect(adease.config.getAdBreaks()).to.not.be.empty;
            expect(adease.getStreams()[0].url).to.equal("http:\/\/sbs-adease.switchmedia.asia\/268\/adEase\/getManifest");
        });
    });

    it('sends beacons', () => {
        nock('http://localhost')
            .get('/')
            .reply(200, FullConfig);

        // Beacon recorder.
        nock(/tidaltv/);
        nock(/scorecardresearch/);
        nock(/doubleclick/);
        const impression = nock('http://sbs-beacons-adease.switchmedia.asia')
            .get('/')
            .reply(200);

        const adease = new Adease();
        return adease.configureFromURL('http://localhost').then(value => {
            // 1000ms, 1sec
            return adease.notifyTimeUpdate(1000);
        }).then(() => {
            expect(impression.isDone()).to.be.true;
        });
    });
});

afterEach(() => {
    // Cleans all nock state between tests, avoiding pollution.
    nock.cleanAll();
});

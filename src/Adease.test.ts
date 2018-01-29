import { expect } from 'chai';
import * as sinon from 'sinon';
import * as nock from 'nock';

import './testPolyfills';

import Adease from './Adease';

// Fixtures
import FullConfig from '../fixtures/sample_full_config';

describe('Adease', () => {
    it('initialises', () => { 
        const adease = new Adease();
        expect(adease).to.be.an.instanceOf(Adease);
    });

    it('processes configuration from an object', () => {
        const adease = new Adease();
        adease.configureFromObject(FullConfig);
        expect(adease.config.getAdBreaks()).to.not.be.empty;
        expect(adease.getStreams()[0].url).to.equal("http:\/\/sbs-adease.switchmedia.asia\/268\/adEase\/getManifest");
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

    it('sends beacons for prerolls', () => {
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
        return adease.configureFromURL('http://localhost').then(() => {
            // Only send the impression after 1000ms
            return adease.notifyTimeUpdate(100);
        }).then(() => {
            expect(impression.isDone()).to.be.false;
        }).then(() => {
            return adease.notifyTimeUpdate(1001);
        }).then(() => {
            expect(impression.isDone()).to.be.true;
        }).then(() => {
            // Should only send beacons once.
            return adease.notifyTimeUpdate(2000);
        });
    });

    it('sends beacons for midrolls', () => {
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
        return adease.configureFromURL('http://localhost').then(() => {
            // Only send the impression after 1000ms
            return adease.notifyTimeUpdate(1407514);
        }).then(() => {
            expect(impression.isDone()).to.be.false;
        }).then(() => {
            return adease.notifyTimeUpdate(1408515);
        }).then(() => {
            expect(impression.isDone()).to.be.true;
        }).then(() => {
            // Should only send beacons once.
            return adease.notifyTimeUpdate(1418515);
        });
    });
});

afterEach(() => {
    // Cleans all nock state between tests, avoiding pollution.
    nock.cleanAll();
});

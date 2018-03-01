import { expect } from "chai";
import * as sinon from "sinon";

import Adease from "./Adease";

declare let global: any;

// Fixtures
import FullConfig from "../fixtures/sample_full_config";

describe("Adease", () => {
  it("initialises", () => {
    const adease = new Adease();
    expect(adease).to.be.an.instanceOf(Adease);
  });

  it("processes configuration from an object", () => {
    const adease = new Adease();
    adease.configureFromObject(FullConfig);
    expect(adease.config.getAdBreaks()).to.not.be.empty;
    expect(adease.getStreams()[0].url).to.equal(
      "http://sbs-adease.switchmedia.asia/268/adEase/getManifest"
    );
  });

  it("retrieves and processes configuration", () => {
    const fetch = (url: string) => {
      return Promise.resolve({
        json: () => FullConfig
      });
    };

    global.fetch = sinon.spy(fetch);

    const adease = new Adease();
    return adease.configureFromURL("http://localhost").then(value => {
      expect(value).to.be.undefined;
      expect(adease.config.getAdBreaks()).to.not.be.empty;
      expect(adease.getStreams()[0].url).to.equal(
        "http://sbs-adease.switchmedia.asia/268/adEase/getManifest"
      );
    });
  });

  it("sends beacons for prerolls", () => {
    const fetch = (url: string, options?: any) => Promise.resolve();

    const fetchSpy = (global.fetch = sinon.spy(fetch));

    const adease = new Adease();
    adease.configureFromObject(FullConfig);
    // Only send the impression after 1000ms
    return adease
      .notifyTimeUpdate(100)
      .then(() => {
        expect(
          fetchSpy.calledWith("http://sbs-beacons-adease.switchmedia.asia")
        ).to.be.false;
      })
      .then(() => {
        return adease.notifyTimeUpdate(1001);
      })
      .then(() => {
        expect(
          fetchSpy.calledWith("http://sbs-beacons-adease.switchmedia.asia")
        ).to.be.true;
        expect(fetchSpy.callCount).to.equal(1);
      })
      .then(() => {
        // Should only send beacons once.
        return adease.notifyTimeUpdate(2000);
      })
      .then(() => {
        expect(fetchSpy.callCount).to.equal(1);
      });
  });

  it("sends beacons for midrolls", () => {
    const fetch = (url: string, options?: any) => Promise.resolve();

    const fetchSpy = (global.fetch = sinon.spy(fetch));

    const adease = new Adease();
    adease.configureFromObject(FullConfig);

    // Only send the impression after 1000ms
    return adease
      .notifyTimeUpdate(1407514)
      .then(() => {
        expect(
          fetchSpy.calledWith("http://sbs-beacons-adease.switchmedia.asia")
        ).to.be.false;
        expect(fetchSpy.callCount).to.equal(0);
      })
      .then(() => {
        return adease.notifyTimeUpdate(1408515);
      })
      .then(() => {
        expect(
          fetchSpy.calledWith("http://sbs-beacons-adease.switchmedia.asia")
        ).to.be.true;
        expect(fetchSpy.callCount).to.equal(19);
      })
      .then(() => {
        // Should only send beacons once.
        return adease.notifyTimeUpdate(1418515);
      })
      .then(() => {
        expect(fetchSpy.callCount).to.equal(23);
      });
  });

  it("sends beacons for quartiles", () => {
    const fetch = (url: string, options?: any) => Promise.resolve();

    const fetchSpy = (global.fetch = sinon.spy(fetch));

    const adease = new Adease();
    adease.configureFromObject(FullConfig);

    // Only send the impression after 1000ms
    return adease
      .notifyTimeUpdate(0)
      .then(() => {
        expect(
          fetchSpy.calledWith("http://firstQuartile-76895")
        ).to.be.false;
        expect(fetchSpy.callCount).to.equal(0);
      })
      .then(() => {
        return adease.notifyTimeUpdate(7700);
      })
      .then(() => {
        expect(
          fetchSpy.calledWith("http://firstQuartile-76895")
        ).to.be.true;
        expect(fetchSpy.callCount).to.equal(5);
      })
      .then(() => {
        // Should only send beacons once.
        return adease.notifyTimeUpdate(7777);
      })
      .then(() => {
        expect(fetchSpy.callCount).to.equal(5);
      })
      .then(() => {
        // Should send midpoint.
        return adease.notifyTimeUpdate(15500);
      })
      .then(() => {
        expect(
            fetchSpy.calledWith("http://midpoint-76895")
          ).to.be.true;
        expect(fetchSpy.callCount).to.equal(9);
      })
      .then(() => {
        // Should send midpoint.
        return adease.notifyTimeUpdate(35000);
      })
      .then(() => {
        expect(
            fetchSpy.calledWith("http://complete-76895")
          ).to.be.true;
        expect(fetchSpy.callCount).to.equal(18);
      });
  });

  it("returns the asset time position", () => {
    // Setup.
    const adease = new Adease();
    adease.configureFromObject(FullConfig);

    // Make assertions.
    expect(adease.getAssetTime(0)).to.equal(0);
    // 40 seconds (right after pre-roll).
    expect(adease.getAssetTime(40 * 1000)).to.equal(9485.31);
    // 3,728 seconds (~ 1 hour)
    expect(adease.getAssetTime(3728 * 1000)).to.equal(3576240.14);
  });
});

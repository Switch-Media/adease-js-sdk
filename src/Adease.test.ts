import { expect } from "chai";
import * as sinon from "sinon";

import Adease from "./Adease";
import { EventType } from "./Configuration";

declare let global: any;
global.VERSION = "test";

// Fixtures
import FullConfig from "../fixtures/sample_full_config";
import FullConfigLive from "../fixtures/sample_full_config_live";
import LiveTrackingData from "../fixtures/live_tracking";
import Issue9Config from "../fixtures/issue_9_full_config";

describe("Adease", () => {
  it("initialises", () => {
    const adease = new Adease();
    expect(adease).to.be.an.instanceOf(Adease);
  });

  it("processes configuration from an object", () => {
    const adease = new Adease();
    adease.configureFromObject(FullConfig);
    expect(adease.getAds()).to.not.be.empty;
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
      expect(adease.getAds()).to.not.be.empty;
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
        expect(fetchSpy.calledWith("http://firstQuartile-76895")).to.be.false;
        expect(fetchSpy.callCount).to.equal(0);
      })
      .then(() => {
        return adease.notifyTimeUpdate(7700);
      })
      .then(() => {
        expect(fetchSpy.calledWith("http://firstQuartile-76895")).to.be.true;
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
        expect(fetchSpy.calledWith("http://midpoint-76895")).to.be.true;
        expect(fetchSpy.callCount).to.equal(9);
      })
      .then(() => {
        // Should send midpoint.
        return adease.notifyTimeUpdate(35000);
      })
      .then(() => {
        expect(fetchSpy.calledWith("http://complete-76895")).to.be.true;
        expect(fetchSpy.callCount).to.equal(18);
      });
  });

  it("returns the asset time position", () => {
    // Setup.
    const adease = new Adease();
    adease.configureFromObject(FullConfig);

    // Make assertions.
    expect(adease.getAssetTime(0)).to.equal(0);

    // During the first pre-roll.
    expect(adease.getAssetTime(15 * 1000)).to.equal(0);

    // 40 seconds (right after pre-roll).
    expect(adease.getAssetTime(40 * 1000)).to.equal(9485.31);

    // 3,728 seconds (~ 1 hour)
    expect(adease.getAssetTime(3728 * 1000)).to.equal(3576240.14);

    // Calculates position correctly when in the middle of an ad.
    expect(adease.getAssetTime(3743864.545)).to.equal(3577000);

    // Uses <= comparison on end times.
    expect(adease.getAssetTime(3743874.545)).to.equal(3577000);
  });

  it("returns the stream time position", () => {
    // Setup.
    const adease = new Adease();
    adease.configureFromObject(FullConfig);

    expect(adease.getStreamTime(0)).to.equal(30514.69);
    expect(adease.getStreamTime(4000)).to.equal(34514.69);
    expect(adease.getStreamTime(4043874)).to.equal(4255974.96);
  });

  it("gets the ads at a specific time", () => {
    // Setup.
    const adease = new Adease();
    adease.configureFromObject(FullConfig);

    // Make assertions.
    let ads = adease.getAdsAtTime(0);
    expect(ads).to.have.length(1);
    expect(ads[0].id).to.equal("76895");

    ads = adease.getAdsAtTime(3743864.545);
    expect(ads).to.have.length(1);
    expect(ads[0].id).to.equal("76914");
  });

  it("sends user actions", () => {
    const fetch = (url: string, options?: any) => Promise.resolve();

    const fetchSpy = (global.fetch = sinon.spy(fetch));

    const adease = new Adease();
    adease.configureFromObject(FullConfig);

    // User actions only work after a call to `notifyTimeUpdate` to initialise the player position.
    return adease
      .notifyTimeUpdate(1)
      .then(() => {
        return adease.notifyPlayerEvent(EventType.Pause, 20);
      })
      .then(() => {
        expect(fetchSpy.calledWith("http://pause-76895")).to.be.true;
        expect(fetchSpy.callCount).to.equal(1);
      })
      .then(() => adease.notifyPlayerEvent(EventType.Pause, 40))
      .then(() => {
        expect(fetchSpy.calledWith("http://pause-76895")).to.be.true;
        expect(fetchSpy.callCount).to.equal(2);
      });
  });

  it("throws an exception if not setup", () => {
    const adease = new Adease();
    expect(() => adease.notifyTimeUpdate(1)).to.throw(Error, /not setup/);
  });
});

// Adease Live
describe("Adease Live", () => {
  it("initialises with live config", () => {
    const adease = new Adease();
    adease.configureFromObject(FullConfigLive);

    expect(adease.getStreams()[0].url).to.equal(
      "https://adease-api-stage.switch.tv/stream/manifest"
    );
  });

  it("parses id3 events and retrieves tracking information", () => {
    const adease = new Adease();
    adease.configureFromObject(FullConfigLive);

    const fetch = (url: string) => {
      return Promise.resolve({
        json: () => LiveTrackingData
      });
    };

    global.fetch = sinon.spy(fetch);

    return adease
      .notifyID3Event("ID3PRIVswitch.tvCUE:158", 154)
      .then(() => {
        return adease.notifyID3Event("ID3PRIVswitch.tvADSTART:abc123-ad", 154);
      })
      .then(() => {
        const ads = adease.getAds();

        expect(ads).to.have.length(1);
        expect(ads[0].startTime).to.equal(154);
        expect(ads[0].endTime).to.equal(154 + 30080);
      });
  });
});

describe("Issue 9", () => {
  it("correctly calculates the stream time", () => {
    const adease = new Adease();
    adease.configureFromObject(Issue9Config);

    expect(adease.getStreamTime(1309214.5)).to.equal(1369386.5);
  })
})

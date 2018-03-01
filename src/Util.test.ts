import { expect } from "chai";

import { round } from './Util';

describe('round', () => {
    it('rounds zero', () => {
        expect(round(0)).to.equal(0);
    })

    it('rounds positive numbers', () => {
        expect(round(1.0)).to.equal(1.0);
        expect(round(11.1998)).to.equal(11.2);
        expect(round(11.15)).to.equal(11.15);
        expect(round(11.155)).to.equal(11.16);
    })

    it('rounds negative numbers', () => {
        expect(round(-1.0)).to.equal(-1.0);
        expect(round(-11.1998)).to.equal(-11.2);
        expect(round(-11.15)).to.equal(-11.15);
        expect(round(-11.155)).to.equal(-11.15);
    })
})
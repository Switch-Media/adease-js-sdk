import { expect } from 'chai';

import { Adease } from './index';

describe('adease library', () => {
    it('exports the Adease class', () => {
        expect(Adease).to.be.a('function');
    })
});
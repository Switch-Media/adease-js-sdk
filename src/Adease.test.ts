import { expect } from 'chai';

import Adease from './Adease';

describe('Adease', () => {
    it('', () => {
        const adease = new Adease('');
        expect(adease).to.be.an.instanceOf(Adease);
    });
});

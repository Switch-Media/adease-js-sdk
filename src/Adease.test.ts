import { expect } from 'chai';

import Adease from './Adease';

// Fixtures
import FullConfig from '../fixtures/sample_full_config';

describe('Adease', () => {
    it('initialises', () => {
        const adease = new Adease('');
        expect(adease).to.be.an.instanceOf(Adease);
    });

    it('parses configuration', () => {
        const adease = new Adease('');

    });
});

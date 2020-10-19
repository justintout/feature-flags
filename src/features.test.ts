import { Features } from './features'
import { should as s } from 'chai'
import 'mocha';

const should = s();

let toggles = 0;
const countToggle = (_: boolean) => toggles+=1;
let lateToggled = false;
const countLateToggle = (enabled: boolean) => lateToggled = true;

const fs = [
    {name: 'simple', enabled: true},
    {name: 'descriptive', enabled: false, description: 'a little extra explanantion'},
    {name: 'dynamic', enabled: false, onToggled: countToggle},
];

Features.add(...fs);

describe('feature-flags', () => {
    describe('status()', () => {
        it('should return an object with only added features for keys', () => {
            const status = Features.status();
            Object.keys(status).should.deep.equal(fs.map((f) => f.name));
        });
        it('should return proper status for added features', () => {
            const expected: {[name in string]: boolean} = {};
            fs.forEach((f) => {
                expected[f.name] = f.enabled;
            });
            Features.status().should.deep.equal(expected);
        });
    }).bail(true);

    describe('add()', () => {
        it('should add new features', () => {
            Features.add({name: 'late entry', enabled: false, onToggled: countLateToggle});
        });
    });

    describe('enabled()', () => {
        it ('should return whether a feature is enabled', () => {
            Features.enabled('simple').should.be.true;
            Features.enabled('descriptive').should.be.false;
            Features.enabled('late entry').should.be.false;
        });
        it('should return false for features that don\'t exist', () => {
            Features.enabled('false').should.be.false;
        });
    });

    describe('toggle()', () => {
        it('should enable/disable a feature', () => {
            Features.toggle('simple').should.be.false;
            Features.toggle('simple').should.be.true;
            Features.enabled('simple').should.be.true;
            Features.toggle('late entry').should.be.true;
            Features.enabled('late entry').should.be.true;
        });
        it('should call a dynamic flag\'s function', () => {
            Features.toggle('dynamic');
            toggles.should.equal(1);
            Features.toggle('dynamic');
            Features.toggle('dynamic');
            toggles.should.equal(3);
            lateToggled = false;
            Features.toggle('late entry');
            lateToggled.should.be.true;
        });
        it('should return false for features that don\'t exist', () => {
            const e = Features.toggle('fake')
            e.should.be.false;
        });
    });

    describe('listen()', () => {
        it ('should add toggleFeature globalThis', () => {
            Features.listen();
            // @ts-ignore
            globalThis['toggleFeature'].should.not.be.undefined;
        });
        it ('should remove toggleFeature when passed false', () => {
            Features.listen(false);
            // @ts-ignore
            (typeof globalThis['toggleFeature']).should.equal('undefined');
        });
    });
});

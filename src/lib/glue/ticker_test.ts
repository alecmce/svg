import { Ticker } from './ticker';

describe('Ticker', () => {
  let log: string[];
  let update: jasmine.Spy;
  let ticker: Ticker;
  beforeEach(() => {
    update = jasmine.createSpy('update');
    ticker = new Ticker(update);
  });

  it('calls udpate repeatedly', (done) => {
    setTimeout(() => {
      expect(update.calls.count() > 1).toBe(true);
      done();
    }, 100);
  });

  it('stops calling update on stop', (done) => {
    update.and.callFake(() => ticker.stop());
    setTimeout(() => {
      expect(update.calls.count()).toEqual(1);
      done();
    }, 100);
  });

  it('starts calling update on start', (done) => {
    update.and.callFake(() => ticker.stop());
    setTimeout(() => ticker.start(), 50);
    setTimeout(() => {
      expect(update.calls.count() > 1).toBe(true);
      done();
    }, 100);
  });
});

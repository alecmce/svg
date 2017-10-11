import { Ticker } from './ticker';

describe('Ticker', () => {
  let log: string[];
  let update: jasmine.Spy;
  let ticker: Ticker;
  beforeEach(() => {
    update = jasmine.createSpy('update');
    ticker = new Ticker();
  });

  it('calls added update repeatedly', (done) => {
    ticker.add(update);
    setTimeout(() => {
      expect(update.calls.count() > 1).toBe(true);
      done();
    }, 100);
  });

  it('calls multiple updates', (done) => {
    const other = jasmine.createSpy('other');
    ticker.add(update);
    ticker.add(other);
    setTimeout(() => {
      expect(update).toHaveBeenCalled();
      expect(other).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('stops calling update on stop', (done) => {
    ticker.add(update);
    update.and.callFake(() => ticker.stop());
    setTimeout(() => {
      expect(update.calls.count()).toEqual(1);
      done();
    }, 100);
  });

  it('starts calling update on start', (done) => {
    ticker.add(update);
    update.and.callFake(() => ticker.stop());
    setTimeout(() => ticker.start(), 50);
    setTimeout(() => {
      expect(update.calls.count() > 1).toBe(true);
      done();
    }, 100);
  });

  it('does not call removed updates', (done) => {
    ticker.add(update);
    ticker.remove(update);
    update.and.callFake(() => ticker.stop());
    setTimeout(() => {
      expect(update).not.toHaveBeenCalled();
      done();
    }, 100);
  });
});

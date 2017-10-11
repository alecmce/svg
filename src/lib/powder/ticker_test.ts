import { Entity, Watch, EntityInstance } from './entity';
import { Ticker } from './ticker';

@Entity
class Example {
  @Watch x = 10;
  constructor(public y = 3) { }
}

describe('Ticker', () => {
  let log: string[];
  let example: Example;
  let updateExample: jasmine.Spy;
  let ticker: Ticker;
  beforeEach(() => {
    example = new Example();
    updateExample = spyOn(example, '__update');
    ticker = new Ticker();
  });

  it('calls added update repeatedly', (done) => {
    ticker.add(example);
    example.x = 20;
    setTimeout(() => {
      expect(updateExample.calls.count() > 1).toBe(true);
      done();
    }, 100);
  });

  it('calls multiple updates', (done) => {
    const other = new Example();
    const otherUpdate = spyOn(other, '__update');
    ticker.add(example);
    ticker.add(other);
    example.x = 20;
    other.x = 20;
    setTimeout(() => {
      expect(updateExample).toHaveBeenCalled();
      expect(otherUpdate).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('stops calling update on stop', (done) => {
    ticker.add(example);
    example.x = 20;
    updateExample.and.callFake(() => ticker.stop());
    setTimeout(() => {
      expect(updateExample.calls.count()).toEqual(1);
      done();
    }, 100);
  });

  it('starts calling update on start', (done) => {
    ticker.add(example);
    updateExample.and.callFake(() => ticker.stop());
    setTimeout(() => ticker.start(), 50);
    setTimeout(() => {
      expect(updateExample.calls.count()).toEqual(0);
      done();
    }, 100);
  });

  it('does not call removed updates', (done) => {
    ticker.add(example);
    ticker.remove(example);
    updateExample.and.callFake(() => ticker.stop());
    setTimeout(() => {
      expect(updateExample).not.toHaveBeenCalled();
      done();
    }, 100);
  });
});

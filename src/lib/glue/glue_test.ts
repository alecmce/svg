import { Glue } from './glue';

describe('glue', () => {
  let glue: Glue;
  beforeEach(() => {
    glue = new Glue();
  });

  it('updates added entities', (done) => {
    const entity = { x: 10, update: jasmine.createSpy('update') };
    glue.add(entity);
    entity.x = 20;
    setTimeout(() => {
      expect(entity.update).toHaveBeenCalled();
      done();
    });
  });

  it('does not update removed entities', (done) => {
    const entity = { x: 10, update: jasmine.createSpy('update') };
    glue.add(entity);
    glue.remove(entity);
    entity.x = 20;
    setTimeout(() => {
      expect(entity.update).not.toHaveBeenCalled();
      done();
    });
  });

  it('does not update entities when stopped', (done) => {
    const entity = { x: 10, update: jasmine.createSpy('update') };
    glue.stop();
    glue.add(entity);
    entity.x = 20;
    setTimeout(() => {
      expect(entity.update).not.toHaveBeenCalled();
      done();
    });
  });

  it('updates entities when started', (done) => {
    const entity = { x: 10, update: jasmine.createSpy('update') };
    glue.stop();
    glue.add(entity);
    entity.x = 20;
    glue.start();
    setTimeout(() => {
      expect(entity.update).toHaveBeenCalled();
      done();
    });
  });
});

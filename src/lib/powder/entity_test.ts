import { Entity, Watch, Resolve, update } from './entity';

@Entity
class Example {
  @Watch x = 10;
  constructor(public y = 3) { }
}

describe('update', () => {
  it('calls update on changed entities', () => {
    const example = new Example();
    example.x = 20;
    const exampleUpdate = spyOn(example, '__update');
    update(example);
    expect(exampleUpdate).toHaveBeenCalled();
  });

  it('does not update unchanged entities', () => {
    const example = new Example();
    const exampleUpdate = spyOn(example, '__update');
    update(example);
    expect(exampleUpdate).not.toHaveBeenCalled();
  });
});

describe('Entity', () => {
  it('preserves parameters', () => {
    expect(new Example().y).toEqual(3);
  });

  describe('__isChanged', () => {
    it('is not considered __isChanged by default', () => {
      const example = new Example();
      expect(example.__isChanged()).toBe(false);
    });

    it('is considered __isChanged when a watched value changes', () => {
      const example = new Example();
      example.x = 20;
      expect(example.__isChanged()).toBe(true);
    });
  });

  describe('__update', () => {
    it('clears __isChanged flag', () => {
      const example = new Example();
      example.x = 20;
      expect(update(example));
      expect(example.__isChanged()).toBe(false);
    });
  });
});

describe('Entity with Entity children', () => {
  @Entity
  class Parent {
    @Watch entity = new Example();
  }

  describe('__isChanged', () => {
    it('is considered __isChanged when a dependency is changed', () => {
      const parent = new Parent();
      parent.entity.x = 20;
      expect(parent.__isChanged()).toBe(true);
    });

    it('is not considered __isChanged when a dependency is updated', () => {
      const parent = new Parent();
      parent.entity.x = 20;
      update(parent.entity);
      expect(parent.__isChanged()).toBe(false);
    });
  });

  describe('__update', () => {
    it('updates watched dependencies', () => {
      const parent = new Parent();
      parent.entity.x = 20;
      const update = spyOn(parent.entity, '__update');
      expect(update(parent));
      expect(update).toHaveBeenCalled();
    });
  });
});

describe('Entity with watched numeric list', () => {
  @Entity
  class NumericList {
    @Watch list: number[] = [1, 2, 3];
  }

  describe('__isChanged', () => {
    it('is considered __isChanged when watched list values change', () => {
      const entity = new NumericList();
      entity.list[1] = 20;
      expect(entity.__isChanged()).toBe(true);
    });

    it('is considered __isChanged when watched list values change', () => {
      const entity = new NumericList();
      entity.list.pop(4);
      expect(entity.__isChanged()).toBe(true);
    });
  });

  describe('__update', () => {
    it('clears ___inChanged false', () => {
      const entity = new NumericList();
      entity.list[1] = 20;
      update(entity);
      expect(entity.__isChanged()).toBe(false);
    });
  });
});

describe('Entity with watched Entity list', () => {
  @Entity
  class EntityList {
    @Watch list: Example[] = [new Example()];
  }

  describe('__isChanged', () => {
    it('is considered __isChanged when watched list values change', () => {
      const entity = new EntityList();
      entity.list[0].x = 20;
      expect(entity.__isChanged()).toBe(true);
    });

    it('is considered __isChanged when watched list values change', () => {
      const entity = new EntityList();
      entity.list.push(new Example());
      expect(entity.__isChanged()).toBe(true);
    });
  });

  describe('__update', () => {
    it('updates listed entity', () => {
      const entity = new EntityList();
      entity.list[0].x = 20;
      const update = spyOn(entity.list[0], '__update');
      update(entity);
      expect(update).toHaveBeenCalled();
    });

    it('clears ___inChanged false', () => {
      const entity = new EntityList();
      entity.list[0].x = 20;
      update(entity);
      expect(entity.__isChanged()).toBe(false);
    });
  });
});

describe('@Resolve', () => {
  @Entity
  class Resolver {
    @Watch x = 10;
    resolveCount = 0;
    constructor() { }

    @Resolve
    resolve() {
      this.resolveCount++;
    }
  }

  it('resolves on construction', () => {
    expect(new Resolver().resolveCount).toEqual(1);
  });

  it('resolves on update', () => {
    const resolver = new Resolver();
    resolver.x = 20;
    update(resolver);
    expect(resolver.resolveCount).toEqual(2);
  });
});
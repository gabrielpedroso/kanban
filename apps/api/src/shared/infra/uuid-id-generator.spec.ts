import { UuidIdGenerator } from './uuid-id-generator';

describe('UuidIdGenerator', () => {
  const gen = new UuidIdGenerator();

  it('gera ids no formato UUID', () => {
    expect(gen.next()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('gera ids diferentes a cada chamada', () => {
    expect(gen.next()).not.toBe(gen.next());
  });
});
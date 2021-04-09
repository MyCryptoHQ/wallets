import { safeJSONParse } from './json';

describe('safeJSONParse', () => {
  it('parses valid JSON', () => {
    expect(safeJSONParse('{ "foo": "bar" }')).toStrictEqual([null, { foo: 'bar' }]);
  });

  it('returns errors', () => {
    expect(safeJSONParse('{ "foo": "bar" asdf }')).toStrictEqual([expect.any(Error), null]);
  });
});

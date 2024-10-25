import { parseCode } from '../index';

function transform(code: string): string {
  const preprocessedCode = parseCode(code);
  return preprocessedCode ?? '';
}

describe('Pipeline Transformer', () => {
  describe('Promise then (+>) operator', () => {
    it('transforms basic then operations', () => {
      const input = `
promise
  +> response => processResponse(response)
`.trim();
      const output = transform(input);
      expect(output).toEqual(`
promise.then(response => processResponse(response));
`.trim());
    });

    it('transforms method shorthand', () => {
      const input = `
fetchResponse
  +> .json()
      `.trim();
      const output = transform(input);
      expect(output).toEqual(`
        fetchResponse.then(result => result.json());
      `.trim());
    });

    it('handles multiple operations', () => {
      const input = `
fetch('/api')
  +> .json()
  +> data => process(data)
  -> error => handleError(error)
      `.trim();
      const output = transform(input);
      expect(output).toEqual(`
fetch('/api').then(result => result.json()).then(data => process(data)).catch(error => handleError(error));
      `.trim());
    });
  });

  describe('Pipeline operator (|>)', () => {
    it('transforms pipeline operations', () => {
      const input = `
value
  |> transform
  |> process
      `.trim();
      const output = transform(input);
      expect(output).toEqual(`
        process(transform(value));
      `.trim());
    });
  });
});

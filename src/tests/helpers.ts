import { transformSync } from '@babel/core';
import plugin from '../index';

/**
 * Helper function to transform code and format it for debugging
 */
export function debugTransform(code: string): void {
  const result = transformSync(code, {
    plugins: [plugin],
    configFile: false,
    retainLines: true,
    compact: false,
    comments: true,
  });
  
  console.log('\nInput:\n', code);
  console.log('\nOutput:\n', result?.code);
}

/**
 * Helper to run actual promises with transformed code
 */
export async function runTransformedCode(code: string): Promise<any> {
  const transformed = transformSync(code, {
    plugins: [plugin],
    configFile: false,
  })?.code;

  if (!transformed) {
    throw new Error('Transform failed');
  }

  return eval(`(async () => { ${transformed} })()`);
}
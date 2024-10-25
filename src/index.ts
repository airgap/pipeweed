import { transformSync, TransformOptions } from "@babel/core";

/**
 * Preprocesses code to replace custom operators with valid JavaScript syntax.
 * @param code - The code to preprocess as a string.
 * @returns The preprocessed code with custom operators replaced.
 */
function preprocessOperators(code: string): string {
  console.log("Original Code:", code);

  // Transform `+> .method()` shorthand to `.then(result => result.method())`
  code = code.replace(
    /([\w.\(\)\s=>]+)\s*\+\>\s*\.(\w+)\(\)/g,
    (_: string, expr: string, method: string): string => {
      return `${expr.trim()}.then(result => result.${method}())`;
    }
  );

  // Iteratively handle pipeline |> operators for nested calls
  while (code.match(/([\w.\(\)\s=>]+)\s*\|\>\s*([\w.]+)/)) {
    code = code.replace(
      /([\w.\(\)\s=>]+)\s*\|\>\s*([\w.]+)/,
      (_, expr: string, func: string): string => {
        return `${func}(${expr.trim()})`;
      }
    );
  }

  // Iteratively handle +> chaining with .then()
  while (code.match(/([\w.\(\)\s=>]+)\s*\+\>\s*([\w.\(\)\s=>]+)/)) {
    code = code.replace(
      /([\w.\(\)\s=>]+)\s*\+\>\s*([\w.\(\)\s=>]+)/,
      (_: string, expr: string, nextFunc: string): string => {
        return `${expr.trim()}.then(${nextFunc.trim()})`;
      }
    );
  }

  // Iteratively handle -> chaining with .catch()
  while (code.match(/([\w.\(\)\s=>]+)\s*\-\>\s*([\w.\(\)\s=>]+)/)) {
    code = code.replace(
      /([\w.\(\)\s=>]+)\s*\-\>\s*([\w.\(\)\s=>]+)/,
      (_: string, expr: string, errorFunc: string): string => {
        return `${expr.trim()}.catch(${errorFunc.trim()})`;
      }
    );
  }

  // Transform `-> console.log(.property)` shorthand to `.catch(error => console.log(error.property))`
  code = code.replace(
    /([\w.\(\)\s=>]+)\s*\-\>\s*(\w+)\(\.(\w+)\)/g,
    (_: string, expr: string, func: string, prop: string): string => {
      return `${expr.trim()}.catch(error => ${func}(error.${prop}))`;
    }
  );

  console.log("Processed Code:", code);
  return code;
}



/**
 * Transforms code by preprocessing custom operators and applying Babel transformations.
 * @param code - The code to transform as a string.
 * @param babelOptions - Optional Babel transformation options.
 * @returns The transformed code as a string.
 */
export function parseCode(
  code: string,
  babelOptions?: TransformOptions
): string | undefined {
  // Preprocess the code to replace custom operators
  const preprocessedCode = preprocessOperators(code);

  // Apply Babel transformations with the custom operators plugin
  const result = transformSync(preprocessedCode, {
    plugins: [],
    sourceType: "module",
    ...babelOptions,
  });

  return result?.code ?? undefined;
}

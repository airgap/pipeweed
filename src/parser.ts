import { declare } from "@babel/helper-plugin-utils";

function preprocessCode(code: string) {
  // Replace custom operators with function calls
  return code
  // Handle foo |> bar across lines/comments
  .replace(/(\w+)\s*\n*\|\>\s*\n*(\w+)/g, "$2($1)")
  // Handle foo +> bar across lines/comments
  .replace(/(\w+)\s*\n*\+\>\s*\n*(\w+)/g, "$1.then($2)")
  // Handle foo -> bar across lines/comments
  .replace(/(\w+)\s*\n*\-\>\s*\n*(\w+)/g, "$1.catch($2)");
}

export default declare((api) => {
  api.assertVersion(7);

  return {
    name: "transform-custom-operators",
    visitor: {
      Program(_, state) {
        // Preprocess code
        const preprocessedCode = preprocessCode(state.file.code);
        state.file.code = preprocessedCode;
      },
    },
  };
});

module.exports = {
    plugins: [
      ['@babel/plugin-syntax-pipeline-operator', { proposal: 'minimal' }],
      './src/index.ts'
    ],
    parserOpts: {
      plugins: ['binaryOperator']
    }
  };
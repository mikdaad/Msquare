module.exports = {
  presets: [
    ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    'nativewind/babel',
  ],
  // Remove the deprecated plugins
  // plugins: ['transform-react-jsx-self', 'transform-react-jsx-source'],
};

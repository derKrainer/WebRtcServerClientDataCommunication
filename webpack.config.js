// for some weird reason i can't build this with webpack :/
// Module not found: Error: Can't resolve './bufferbuilder' in '...WebRtcMessageBroker\node_modules\peerjs-js-binarypack\lib'
//  @ ./node_modules/peerjs/dist/bundler.mjs 1:0-61 135:20-50 136:22-54
//  @ ./src/server.ts 1:0-26 25:25-29
const path = require('path');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      server: './src/server.ts',
      client: './src/client.ts',
    },
    target: 'web',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts']
    },
  };
};

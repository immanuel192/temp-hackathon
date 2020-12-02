/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const dotenv = require('dotenv');

if (process.env.DOTENV) {
  dotenv.config({ path: process.env.DOTENV });
} else {
  dotenv.config();
}

/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pwa: {
    workboxPluginMode: 'GenerateSW',
    manifestPath: 'manifest.json',
    workboxOptions: {

    },
  },
  integrity: true,
  configureWebpack: () => {
    const keys = Object.keys(process.env);
    const items = keys.filter((key) => key.match(/^CONFIG_/));

    console.log('ENV VARIABLE:', JSON.stringify(items));

    const values = items.reduce((total, key) => ({
      ...total,
      [key.replace(/^CONFIG_/, '')]: process.env[key],
    }), {});

    const file = `window.__APPCONFIG__ = ${JSON.stringify(values)}\n`;
    fs.writeFileSync('public/config.js', file);
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => [
        {
          ...args[0],
          templateParameters: (compilation, assets, pluginOptions) => {
            assets.js.push('/config.js');
            return args[0].templateParameters(compilation, assets, pluginOptions);
          },
        },
      ]);
  },
};

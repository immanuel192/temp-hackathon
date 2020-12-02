// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {

}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __APPCONFIG__: Config;
  }
}

const defaultConfig = {
} as Config;

// eslint-disable-next-line no-underscore-dangle
const windowConfig: Config = window.__APPCONFIG__ || defaultConfig;
export default windowConfig;

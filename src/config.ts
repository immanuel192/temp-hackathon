// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {
  API_KEY: string
  PROJECT_ID: string
  SENDER_ID: string
  APP_ID: string
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

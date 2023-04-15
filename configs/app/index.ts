import { AppConfig } from './appConfig'
import defaultConfig from './default.json'

const userConfigFile = process.env.WINGS_CONFIG

let userConfig = {}

if (userConfigFile) {
  try {
    userConfig = require(`./${userConfigFile}.json`)
  } catch (error) {
    console.error(`Failed to load user config file: ${userConfigFile}.json`, error)
    process.exit(1)
  }
}

const config: AppConfig = {
  ...defaultConfig,
  ...userConfig,
}

export default config

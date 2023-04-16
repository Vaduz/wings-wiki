import pino from 'pino'

const isDev = process.env.WINGS_ENV !== 'production'

const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: isDev,
      ignore: 'pid',
      translateTime: 'SYS:standard',
      singleLine: !isDev,
    },
  },
})

export default logger

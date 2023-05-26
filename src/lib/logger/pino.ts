import pino from 'pino'

const isDev = process.env.WINGS_ENV !== 'production'

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: isDev,
      ignore: 'pid',
      translateTime: 'SYS:standard',
      singleLine: isDev ? true : true,
    },
  },
})

export default logger

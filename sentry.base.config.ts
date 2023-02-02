import getConfig from 'next/config'

const SENTRY_DSN: string =
  'https://a958703d7652403ab9b078ab451d3d97@o1364656.ingest.sentry.io/4504015179481088'

export const sentryBaseConfig = {
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV,
  // release is also used for source map uploads at build time,
  // so ensure that SENTRY_RELEASE is the same at build time.
  release: process.env.SENTRY_RELEASE || getConfig()?.publicRuntimeConfig?.sentryRelease,
  enabled: process.env.NEXT_PUBLIC_SENTRY_ENV !== 'development',
}

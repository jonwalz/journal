export const config = {
  api: {
    timeout: 5000,
    maxRetries: 3,
  },
  theme: {
    cookieName: 'theme',
    defaultTheme: 'light' as const,
  },
  meta: {
    defaultTitle: 'My Remix App',
    defaultDescription: 'A modern web application built with Remix',
  },
} as const;

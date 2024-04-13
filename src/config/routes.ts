export const AppRoutes = {
  '404': '/404',
  _offline: '/_offline',
  terms: '/terms',
  privacy: '/privacy',
  licenses: '/licenses',
  index: '/',
  imprint: '/imprint',
  cookie: '/cookie',
  addressBook: '/address-book',
  addOwner: '/addOwner',
  balances: {
    nfts: '/balances/nfts',
    index: '/balances',
  },
  newSafe: {
    load: '/new-safe/load',
    create: '/new-safe/create',
  },
  settings: {
    setup: '/settings/setup',
    securityLogin: '/settings/security-login',
    modules: '/settings/modules',
    index: '/settings',
    environmentVariables: '/settings/environment-variables',
    data: '/settings/data',
    cookies: '/settings/cookies',
    appearance: '/settings/appearance',
  },
  transactions: {
    tx: '/transactions/tx',
    queue: '/transactions/queue',
    messages: '/transactions/messages', // TODO(devanon): implement messages
    index: '/transactions',
    history: '/transactions/history',
  },
  welcome: {
    index: '/welcome',
  },
}

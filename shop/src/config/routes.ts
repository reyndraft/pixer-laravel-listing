const routes = {
  home: '/',
  authors: '/authors',
  submitTool: '/submit-tool',
  explore: '/explore',
  popularProducts: '/popular-tools',
  about: '/about-us',
  contact: '/contact-us',
  purchases: '/purchases',
  wishlists: '/favorites' /*'/wishlists'*/,
  reports: '/reports',
  questions: '/questions',
  profile: '/profile',
  checkout: '/checkout',
  help: '/help',
  licensing: '/licensing',
  refund: '/refund',
  terms: '/terms',
  privacy: '/privacy',
  password: '/password',
  feed: '/feed',
  followedShop: '/followed-authors',
  orderUrl: (tracking_number: string) =>
    `/orders/${encodeURIComponent(tracking_number)}`,
  productUrl: (slug: string) => `/tools/${slug}`,
  tagUrl: (slug: string) => `/tools/tags/${slug}`,
  categoryUrl: (slug: string) => `/?category=${slug}`,
  shopUrl: (slug: string) => `/authors/${slug}`,
  product: (slug: string) => {
    return `/tools/${encodeURIComponent(slug)}`;
  },
  cards: '/cards',
};
export default routes;

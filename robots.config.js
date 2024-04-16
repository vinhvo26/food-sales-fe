export default [
  { UserAgent: '*' },
  { Disallow: '/admin' },
  { Disallow: '/manage-sales-information' },
  { BlankLine: true },
  { Comment: 'Sitemap' },
  { Sitemap: req => `https://${req.headers.host}/sitemap.xml` },
]


export const routes = {
  home: '/',
  stats: '/stats',
  dashboard: {
    root: '/dashboard',
    stats: '/dashboard/stats',
  },
  biolink: {
    root: '/biolink',
    create: '/biolink/create',
    edit: (id: string | number) => `/biolink/edit/${id}`,
    builder: (id: string | number) => `/biolink/builder/${id}`,
    preview: (slug: string) => `/preview/${slug}`,
  },
  admin: {
    root: '/admin',
    urls: '/admin/urls',
    flagged: '/admin/urls/flagged',
    users: '/admin/users',
  },
  profile: (slug: string) => `/${slug}`,
};

export default function () {
  return [
    // {
    //   title: 'Blog Dashboard',
    //   to: '/blog-overview',
    //   htmlBefore: '<i class="material-icons">edit</i>',
    //   htmlAfter: '',
    // },
    {
      title: 'Users',
      htmlBefore: '<i class="material-icons">people</i>',
      to: '/users',
      adminRoles: [1],
    },
    {
      title: 'Printing',
      htmlBefore: '<i class="material-icons">print</i>',
      to: '/printing',
      adminRoles: [1, 2],
    },
    {
      title: 'PSD Scripts',
      htmlBefore: '<i class="material-icons">dynamic_feed</i>',
      to: '/psd-scripts',
      adminRoles: [1],
    },
    {
      title: 'Reports',
      htmlBefore: '<i class="material-icons">show_chart</i>',
      to: '/reports',
      adminRoles: [1],
    },
    // {
    //   title: 'Book Contents',
    //   htmlBefore: '<i class="material-icons">library_books</i>',
    //   to: '/book-contents',
    // },
  ];
}

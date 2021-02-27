export default function () {
  return [
    {
      title: 'Dashboard',
      to: '/',
      htmlBefore: '<i class="material-icons">edit</i>',
      // htmlAfter: '',
      adminRoles: ['admin'],
    },
    {
      title: 'Users',
      htmlBefore: '<i class="material-icons">people</i>',
      to: '/users',
      adminRoles: ['admin'],
    },
    {
      title: 'Printing',
      htmlBefore: '<i class="material-icons">print</i>',
      to: '/printing',
      adminRoles: ['admin', 'printing'],
    },
    {
      title: 'PSD Scripts',
      htmlBefore: '<i class="material-icons">dynamic_feed</i>',
      to: '/psd-scripts',
      adminRoles: ['admin', 'printing'],
    },
    {
      title: 'Reports',
      htmlBefore: '<i class="material-icons">show_chart</i>',
      to: '/reports',
      adminRoles: ['admin'],
    },
    // {
    //   title: 'Book Contents',
    //   htmlBefore: '<i class="material-icons">library_books</i>',
    //   to: '/book-contents',
    // },
  ];
}

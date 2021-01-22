// import React from "react";
// import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from './layouts';

// Route Views
import BlogOverview from './views/BlogOverview';
import Users from './views/Users';
import Printing from './views/Printing';
import PsdScripts from './views/PsdScripts';
import Reports from './views/Reports';
// import UserProfileLite from "./views/UserProfileLite";
// import AddNewPost from "./views/AddNewPost";
import Errors from './views/Errors';
// import ComponentsOverview from "./views/ComponentsOverview";
// import Tables from "./views/Tables";
// import BlogPosts from "./views/BlogPosts";

export default [
  {
    path: '/',
    exact: true,
    layout: DefaultLayout,
    component: BlogOverview,
    adminRoles: [],
  },
  {
    path: '/users',
    exact: true,
    layout: DefaultLayout,
    component: Users,
    adminRoles: [1],
  },
  {
    path: '/printing',
    exact: true,
    layout: DefaultLayout,
    component: Printing,
    adminRoles: [1, 2],
  },
  {
    path: '/psd-scripts',
    exact: true,
    layout: DefaultLayout,
    component: PsdScripts,
    adminRoles: [1, 2],
  },
  {
    path: '/reports',
    exact: true,
    layout: DefaultLayout,
    component: Reports,
    adminRoles: [1],
  },
  // {
  //   path: "/blog-overview",
  //   layout: DefaultLayout,
  //   component: BlogOverview
  // },
  // {
  //   path: "/user-profile-lite",
  //   layout: DefaultLayout,
  //   component: UserProfileLite
  // },
  // {
  //   path: "/add-new-post",
  //   layout: DefaultLayout,
  //   component: AddNewPost
  // },
  {
    path: '/error',
    layout: DefaultLayout,
    component: Errors,
    adminRoles: [],
  },
  // {
  //   path: "/components-overview",
  //   layout: DefaultLayout,
  //   component: ComponentsOverview
  // },
  // {
  //   path: "/tables",
  //   layout: DefaultLayout,
  //   component: Tables
  // },
  // {
  //   path: "/blog-posts",
  //   layout: DefaultLayout,
  //   component: BlogPosts
  // }
];

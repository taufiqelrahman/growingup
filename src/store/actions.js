// import * as cartActions from './cart/actions';
// import * as ordersActions from './orders/actions';
// import { ThunkAction } from 'redux-thunk';
// import { Action } from 'redux';
// import { captureException } from '@sentry/core';
// import api from 'services/api';
// import * as productsActions from './products/actions';
// import * as usersActions from './users/actions';
// import * as masterActions from './master/actions';
import * as types from './types';

export const setErrorMessage = (message) => {
  return {
    type: types.SET_ERROR_MESSAGE,
    payload: message,
  };
};

function toggleSidebar() {
  return {
    type: types.TOGGLE_SIDEBAR,
  };
}

export default {
  // ...cartActions,
  // ...ordersActions,
  // ...productsActions,
  // ...usersActions,
  // ...masterActions,
  setErrorMessage,
  toggleSidebar,
};

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';
// import cartReducer from './cart/reducers';
// import ordersReducer from './orders/reducers';
// import productsReducer from './products/reducers';
// import usersReducer from './users/reducers';
// import masterReducer from './master/reducers';

const rootReducer = combineReducers({
  default: reducer,
  // cart: cartReducer,
  // orders: ordersReducer,
  // products: productsReducer,
  // users: usersReducer,
  // master: masterReducer,
});

const isBrowser = typeof window != 'undefined';
const reduxOption = { trace: true, traceLimit: 25 };
const composeEnhancer =
  isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(reduxOption)
    : compose;

export function initializeStore(initialState) {
  return createStore(rootReducer, initialState, composeEnhancer(applyMiddleware(thunkMiddleware)));
}

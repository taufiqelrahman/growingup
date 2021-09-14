import { EventEmitter } from 'events';

import dispatcher from './dispatcher';
import CONSTANTS from './constants';
import getSidebarNavItems from '../config/sidebar-nav-items';

const CHANGE_EVENT = 'change';

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
  users: [],
  me: null,
  orders: [],
  ordersReport: [],
  printings: [],
  printingOrders: [],
  children: [],
};

class Store extends EventEmitter {
  // retrieve data
  getMenuState() {
    return _store.menuVisible;
  }

  getSidebarItems() {
    return _store.navItems;
  }

  getUsers() {
    return _store.users;
  }

  getMe() {
    return _store.me;
  }

  getOrders() {
    return _store.orders;
  }

  getOrdersReport() {
    return _store.ordersReport;
  }

  getPrintings() {
    return _store.printings;
  }

  getPrintingOrders() {
    return _store.printingOrders;
  }

  getChildren() {
    return _store.children;
  }

  // base
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
}

const store = new Store();

dispatcher.register((action) => {
  switch (action.actionType) {
    case CONSTANTS.TOGGLE_SIDEBAR:
      _store.menuVisible = !_store.menuVisible;
      break;
    case CONSTANTS.GET_USERS:
      _store.users = action.data;
      break;
    case CONSTANTS.GET_ME:
      _store.me = action.data;
      break;
    case CONSTANTS.GET_ORDERS:
      _store.orders = action.data.orders;
      _store.printings = action.data.printings;
      break;
    case CONSTANTS.GET_ORDERS_REPORT:
      _store.ordersReport = action.data.orders;
      break;
    case CONSTANTS.GET_PRINTING_ORDERS:
      _store.printingOrders = action.data;
      break;
    case CONSTANTS.GET_CHILDREN:
      _store.children = action.data;
      break;
    default:
  }
  store.emitChange();
});

export default store;

import { EventEmitter } from 'events';

import dispatcher from './dispatcher';
import CONSTANTS from './constants';
import getSidebarNavItems from '../config/sidebar-nav-items';

const CHANGE_EVENT = 'change';

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
  users: [],
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
    default:
  }
  store.emitChange();
});

export default store;

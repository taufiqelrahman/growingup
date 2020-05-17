import * as types from './types';
import getSidebarNavItems from '../data/sidebar-nav-items';

const initState = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case types.TOGGLE_SIDEBAR: {
      return {
        ...state,
        menuVisible: !state.menuVisible,
      };
    }
    default:
      return state;
  }
};
export default reducer;

import React from 'react';

import { initializeStore } from '../store';
import actions from '../store/actions';
import { bindActionCreators } from 'redux';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState);
  }

  // Store in global variable if client
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
}

const withReduxStore = (Component) => {
  return class Redux extends React.Component {
    static async getInitialProps(appContext) {
      const reduxStore = getOrCreateStore();

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (Component.getInitialProps) {
        appProps = await Component.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      };
    }

    constructor(props) {
      super(props);
      // eslint-disable-next-line react/prop-types
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      return <Component {...this.props} reduxStore={this.reduxStore} />;
    }
  };
};

export default withReduxStore;
export const mapStateToProps = (state) => ({ state });
export const mapDispatchToProps = (dispatch) => ({ ...bindActionCreators(actions, dispatch) });
// export type Dispatchable<P> = P & ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

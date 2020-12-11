import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { getMe } from './flux/actions';
import store from './flux/store';

import routes from './routes';
import withTracker from './withTracker';

import 'bootstrap/dist/css/bootstrap.min.css';
import './shards-dashboard/styles/shards-dashboards.1.1.0.min.css';

const App = () => {
  const [me, setMe] = useState(store.getMe());
  useEffect(() => {
    store.addChangeListener(onChange);
    if (!store.getMe()) getMe();
    return () => store.removeChangeListener(onChange);
  }, []);
  function onChange() {
    setMe(store.getMe());
  }
  return (
    <Router basename={process.env.REACT_APP_BASENAME || ''}>
      <div>
        {me &&
          routes.map((route, index) => {
            const isNotHomeOrError = !['/', '/error'].includes(route.path);
            if (isNotHomeOrError && !route.adminRoles.includes(me.is_admin)) return null;
            const useFooter = route.path !== '/printing';
            return (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={withTracker((props) => {
                  return (
                    <route.layout {...props} noFooter={!useFooter}>
                      <route.component {...props} />
                    </route.layout>
                  );
                })}
              />
            );
          })}
      </div>
    </Router>
  );
};

export default App;

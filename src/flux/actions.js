import dispatcher from './dispatcher';
import constants from './constants';
import api from '../services/api';

export function getUsers() {
  api()
    .users.get()
    .then(({ data }) => {
      dispatcher.dispatch({
        actionType: constants.GET_USERS,
        data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

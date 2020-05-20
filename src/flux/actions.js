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

export function updateUser(id, data) {
  api()
    .users.update(id, data)
    .then(() => {
      getUsers();
    })
    .catch((err) => {
      console.log(err);
    });
}

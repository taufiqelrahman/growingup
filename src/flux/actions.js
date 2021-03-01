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
    .catch(() => {
      // console.log(err);
    });
}

export function getMe() {
  api()
    .users.me()
    .then(({ data }) => {
      dispatcher.dispatch({
        actionType: constants.GET_ME,
        data,
      });
    })
    .catch(() => {
      // console.log(err);
    });
}

export function updateUser(id, data) {
  api()
    .users.update(id, data)
    .then(() => {
      getUsers();
    })
    .catch(() => {
      // console.log(err);
    });
}

export function getChildren() {
  api()
    .children.get()
    .then(({ data }) => {
      dispatcher.dispatch({
        actionType: constants.GET_CHILDREN,
        data: data.data.children,
      });
    })
    .catch(() => {
      // console.log(err);
    });
}

export function getPrintingOrders() {
  api()
    .orders.get()
    .then(({ data }) => {
      const { orders, order_printing: printings } = data.data;
      let result = {};
      orders.forEach((order) => {
        result[`WIGU-${order.order_number}`] = { ...order };
      });
      printings.forEach((printing) => {
        result[printing.order_number] = {
          ...result[printing.order_number],
          ...printing,
        };
      });
      dispatcher.dispatch({
        actionType: constants.GET_PRINTING_ORDERS,
        data: Object.values(result).filter((order) => !!order.printings && order.fulfillments),
      });
    })
    .catch(() => {
      // console.log(err);
    });
}

export function getOrders() {
  api()
    .orders.get()
    .then(({ data }) => {
      const { orders, order_printing: printings } = data.data;
      let result = {};
      orders.forEach((order) => {
        result[`WIGU-${order.order_number}`] = { ...order };
      });
      printings.forEach((printing) => {
        result[printing.order_number] = {
          ...result[printing.order_number],
          ...printing,
        };
      });
      dispatcher.dispatch({
        actionType: constants.GET_ORDERS,
        data: {
          orders: Object.values(result).filter((order) => order.fulfillments),
          printings: data.data.order_printing,
        },
      });
    })
    .catch(() => {
      // console.log(err);
    });
}

export function updateOrder(id, data) {
  api()
    .orders.update(id, data)
    .then(() => {
      getPrintingOrders();
    })
    .catch(() => {
      // console.log(err);
    });
}

export function fulfillOrder(id, data) {
  api()
    .orders.fulfill(id, data)
    .then(() => {
      getPrintingOrders();
    })
    .catch(() => {
      // console.log(err);
    });
}

export function updateFulfillment(id, fulfillmentId, data) {
  api()
    .orders.updateFulfillment(id, fulfillmentId, data)
    .then(() => {
      getPrintingOrders();
    })
    .catch(() => {
      // console.log(err);
    });
}

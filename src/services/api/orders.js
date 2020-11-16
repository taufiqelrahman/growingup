export default class Products {
  constructor(adapter) {
    this.adapter = adapter;
  }

  get() {
    return this.adapter.secure.get('/orderslist');
  }

  update(id, data) {
    return this.adapter.secure.patch(`/orderslist/${id}`, data);
  }

  fulfill(id, data) {
    return this.adapter.secure.post(`/orders/${id}/fulfill`, {
      data: {
        fulfillment: {
          location_id: 37571657861,
          notify_customer: true,
          ...data,
        },
      },
    });
  }

  updateFulfillment(id, fulfillmentId, data) {
    return this.adapter.secure.put(`/orders/${id}/fulfillment/${fulfillmentId}`, {
      data: {
        fulfillment: { ...data },
      },
    });
  }
}

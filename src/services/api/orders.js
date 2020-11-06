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
}

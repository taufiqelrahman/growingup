export default class Products {
  constructor(adapter) {
    this.adapter = adapter;
  }

  get() {
    return this.adapter.secure.get('/users');
  }

  update(id, data) {
    return this.adapter.secure.patch(`/users/${id}`, data);
  }

  me() {
    return this.adapter.secure.get('/me');
  }
}

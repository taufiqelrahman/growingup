export default class Products {
  constructor(adapter) {
    this.adapter = adapter;
  }

  isAdmin() {
    return this.adapter.secure.get('/is-admin');
  }

  get() {
    return this.adapter.secure.get('/users');
  }

  update(id, data) {
    return this.adapter.secure.patch(`/users/${id}`, data);
  }
}

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
}

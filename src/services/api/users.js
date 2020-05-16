export default class Products {
  constructor(adapter) {
    this.adapter = adapter;
  }

  isAdmin(data) {
    return this.adapter.secure.get('/is-admin');
  }
}

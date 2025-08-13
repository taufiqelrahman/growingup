export default class Children {
  constructor(adapter) {
    this.adapter = adapter;
  }

  get() {
    return this.adapter.secure.get('/children');
  }
}

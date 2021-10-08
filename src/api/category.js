import BaseAPI from "./base";
class Category extends BaseAPI {
  constructor() {
    super();
    this.url = "/category/";
  }
}

export default new Category();

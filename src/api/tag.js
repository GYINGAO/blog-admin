import BaseAPI from "./base";
class Tag extends BaseAPI {
  constructor() {
    super();
    this.url = "/tag/";
  }
}

export default new Tag();

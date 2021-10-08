import BaseAPI from "./base";
import request from "@/utils/request";

class Article extends BaseAPI {
  constructor() {
    super();
    this.url = "/article/";
  }

  create(data) {
    return request({
      url: this.url,
      method: "post",
      data,
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  show(id) {
    return request({
      url: this.url + id,
      method: "get"
    });
  }
}

export default new Article();

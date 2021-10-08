import request from "@/utils/request";

class BaseAPI {
  select(params) {
    return request({
      url: this.url,
      method: "get",
      params
    });
  }
  create(data) {
    return request({
      url: this.url,
      method: "post",
      data
    });
  }

  remove(id) {
    return request({
      url: this.url + id,
      method: "delete"
    });
  }

  update(id, data) {
    return request({
      url: this.url + id,
      method: "put",
      data
    });
  }
}

export default BaseAPI;

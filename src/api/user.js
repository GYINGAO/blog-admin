import BaseAPI from "./base";
import request from "@/utils/request";

class User extends BaseAPI {
  constructor() {
    super();
    this.url = "/user/";
  }
  login(data) {
    return request({
      url: this.url + "login",
      method: "post",
      data
    });
  }

  getInfo() {
    return request({
      url: "/user_info",
      method: "get"
    });
  }

  logout() {
    return request({
      url: this.url + "logout",
      method: "post"
    });
  }

  register(data) {
    return request({
      url: this.url + "register",
      method: "post",
      data
    });
  }

  upload(data) {
    return request({
      url: this.url + "avatar",
      method: "post",
      data,
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
}

export default new User();

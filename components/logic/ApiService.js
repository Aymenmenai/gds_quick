import axios from "axios";

class ApiService {
  constructor(root, id) {
    this.root = root;
    this.id = id || undefined;
  }

  movementA(obj, time) {
    // console.log(time)
    return axios.post(`/api/v1/${this.root}/activitesa/${obj}`, time);
  }

  movement(obj, time) {
    return axios.post(`/api/v1/${this.root}/activites/${obj}`, time);
  }

  create(obj) {
    return axios.post(`/api/v1/${this.root}/add`, obj);
  }

  updateUser(obj) {
    return axios.patch(`/api/v1/user/settings`, obj);
  }
  getCurrUser() {
    return axios.get(`/api/v1/user/me`);
  }

  update(arr) {
    return axios.patch(`/api/v1/${this.root}/update/${arr[0]}`, arr[1]);
  }
  superSeach(term) {
    // console.log(`api/v1/${this.root}/supersearch/${term}`);
    return axios.get(`/api/v1/${this.root}/supersearch/${term}`);
  }

  delete(id) {
    return axios.delete(`/api/v1/${this.root}/delete/${this.id || id}`);
  }

  login(credentials) {
    return axios.post(`/api/v1/user/login`, credentials);
  }

  getOne() {
    return axios.get(`/api/v1/${this.root}/find/${this.id}`);
  }

  getMany(filter) {
    // console.log(
    //   `/api/v1/${this.root}/all${
    //     filter ? filter + `&sort=-createdAt` : "?sort=-createdAt"
    //   }`
    // );
    return axios.get(
      `/api/v1/${this.root}/all${filter ? filter + `&sort=-createdAt` : "?sort=-createdAt"
      }`
    );
  }

  getMaxMin(field) {
    return axios.get(`/api/v1/${this.root}/maxmin/${field}`);
  }

  logout() {
    return axios.post(`/api/v1/user/logout`, {});
  }

  generateReference(id) {
    return axios.post(`/api/v1/reference/generate/${id}`);
  }

  getAlert() {
    return axios.get(`/api/v1/article/alert`);
  }

  count(data) {
    return axios.post(`/api/v1/${this.root}/count`, {
      year: data || undefined,
    });
  }
  // NEW
  exportfile(data) {
    // console.log("HELLO", `/api/v1/${this.root}/export`);
    return axios.get(`/api/v1/${this.root}/export`);
  }
  auth() {
    return axios.get("/api/v1/auth/check");
  }
  group(filter) {
    return axios.get(
      `/api/v1/${this.root}/group${filter ? filter + `&sort=-createdAt` : "?sort=-createdAt"
      }`
    );
  }
}

export default ApiService;

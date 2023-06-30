import axiosClient from "./axiosClient";
import { labbackup } from "const/config";
// import {  setConditions } from 'const';

const storageApi = {
  getAll: (e) => {
    let url = "";
    if (e !== undefined) {
      url = `${labbackup}/api/v1/benji/storages`.concat(
        `?page=${e?.page}&page_size=${e?.page_size}`
      );
    } else {
      url = `${labbackup}/api/v1/benji/storages?page=1&page_size=10`;
    }
    return axiosClient.get(url);
  },
  delItem: (item) => {
    const delId = item;
    const url = `${labbackup}/api/v1/benji/storage/` + delId;
    return axiosClient.delete(url);
  },
};

export default storageApi;

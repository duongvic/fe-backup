import axiosClient from "./axiosClient";
import {labbackup} from "const/config";

const policyApi = {
  getAll: (e) => {
    
    let url = ''
    if(e !== undefined){
       url = `${labbackup}/api/v1/benji/schedule/jobs`+ `?page=${e?.page}&page_size=${e?.page_size}`;
    }else{
      url = `${labbackup}/api/v1/benji/schedule/jobs?page=1&page_size=10`;
    }
    return axiosClient.get(url);
  },
  delItem: (item) => {
    const delId = item;
    const url = `${labbackup}/api/v1/benji/schedule/job/` + delId;
    return axiosClient.delete(url);
  },
  createItem: () => {
    const url = `${labbackup}/api/v1/benji/schedule/jobs`;
    return axiosClient.post(url);
  },
  updateItem: (item) => {
    const url = `${labbackup}/api/v1/benji/schedule/job` + item.id;
    return axiosClient.put(url);
  },
  groupBackup: () => {
    const url = `${labbackup}/api/v1/benji/volume-groups`;
    return axiosClient.get(url);
  },
}

export default policyApi; 

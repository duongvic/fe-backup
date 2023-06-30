import axiosClient from "./axiosClient";
import {labbackup} from "const/config";
// import {  setConditions } from 'const';

const backupApi = {
  getAll: (e) => {
    let url = ''
    if(e !== undefined){
       url = `${labbackup}/api/v1/benji/versions`+ `?page=${e?.page}&page_size=${e?.page_size}`;
    }else{
      url = `${labbackup}/api/v1/benji/versions?page=1&page_size=10`;
    }
    return axiosClient.get(url);
  },
  delItem: (item) => {
    const delId = item;
    const url = `${labbackup}/api/v1/benji/version/` + delId;
    return axiosClient.delete(url);
  },
  restoreItem: (item) => {
    const restoreId = item;
    const url = `${labbackup}/api/v1/benji/version/` + restoreId;
    return axiosClient.post(url);
  },

  manualItem: (item) => {
    const url = `${labbackup}/api/v1/benji/versions ` ;
    return axiosClient.post(url);
  },

  listVolume: (e) => {
    const url = `${labbackup}/api/v1/benji/vm` + "/" + e + "/volumes" ;
    return axiosClient.get(url);
  },
  
  listVm: (e) => {
      let url = ''
      if (e !== undefined) {
        url = `${labbackup}/api/v1/benji/vms`+ `?page=${e?.page}&page_size=${e?.page_size}`;
      } else {
        url = `${labbackup}/api/v1/benji/vms?page=1&page_size=10`;
      }
    
   
    return axiosClient.get(url);
  },
}

export default backupApi; 

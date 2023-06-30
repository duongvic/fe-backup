import axiosClient from "./axiosClient";
import {labbackup} from "const/config";
const groupApi = {
  getAll: (e) => {
    let url = ''
    if(e !== undefined){
       url = `${labbackup}/api/v1/benji/volume-groups`+ `?page=${e?.page}&page_size=${e?.page_size}`;
    }else{
      url = `${labbackup}/api/v1/benji/volume-groups?page=1&page_size=10`;
    }
    return axiosClient.get(url);
  },
  
}

export default groupApi; 

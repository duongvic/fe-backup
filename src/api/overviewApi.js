import axiosClient from "./axiosClient";
import {labbackup} from "const/config";
// import {  setConditions } from 'const';

const overviewApi = {
  getAll: (e) => {
    let url = ''
    if(e !== undefined){
       url = `${labbackup}/api/v1/benji/users/statistic`+ `?page=${e?.page}&page_size=${e?.page_size}`;
    }else{
      url = `${labbackup}/api/v1/benji/users/statistic`;
    }
    return axiosClient.get(url);
  },
 
}

export default overviewApi; 